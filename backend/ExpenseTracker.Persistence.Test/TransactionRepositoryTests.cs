using ExpenseTracker.Domain;
using ExpenseTracker.Persistence.Context;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Persistence.Test
{
    public class TransactionRepositoryTests
    {
        private ApplicationDbContext _context;
        private TransactionRepository _repository;
        private CancellationToken _cancellationToken;
        private SqliteConnection _connection;

        [SetUp]
        public async Task Setup()
        {
            // Create SQLite in-memory database connection
            _connection = new SqliteConnection("DataSource=:memory:");
            await _connection.OpenAsync();

            // Configure DbContext to use SQLite in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(_connection)
                .Options;

            _context = new ApplicationDbContext(options);

            // Create the database schema
            await _context.Database.EnsureCreatedAsync();

            _repository = new TransactionRepository(_context);
            _cancellationToken = CancellationToken.None;
        }

        [TearDown]
        public async Task TearDown()
        {
            if(_context != null)
            {
                await _context.DisposeAsync();
            }

            if (_connection != null)
            {
                await _connection.DisposeAsync();
            }
        }

        [Test]
        public async Task AddAsync_WithValidTransaction_ShouldReturnPositiveId()
        {
            // Arrange
            var transaction = new Transaction(
                date: DateTime.Now.Date,
                description: "Test Expense",
                unitPrice: 15.50m,
                quantity: 2
            );

            // Act
            var result = await _repository.AddAsync(transaction, _cancellationToken);

            // Assert
            Assert.That(result, Is.GreaterThan(0));

            // Verify it was actually saved
            var savedTransaction = await _context.Set<Transaction>().FindAsync(result);
            Assert.That(savedTransaction, Is.Not.Null);
            Assert.That(savedTransaction.Description, Is.EqualTo("Test Expense"));
        }

        [Test]
        public async Task GetAllAsync_ShouldReturnAllTransactions()
        {
            // Arrange
            var transaction1 = new Transaction(DateTime.Now.Date, "Test 1", 10.00m, 1);
            var transaction2 = new Transaction(DateTime.Now.Date, "Test 2", 20.00m, 2);

            await _repository.AddAsync(transaction1, _cancellationToken);
            await _repository.AddAsync(transaction2, _cancellationToken);

            // Act
            var result = await _repository.GetAllAsync(_cancellationToken);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Has.Count.EqualTo(2));
            Assert.That(result.Any(t => t.Description == "Test 1"), Is.True);
            Assert.That(result.Any(t => t.Description == "Test 2"), Is.True);
        }

        [Test]
        public async Task GetAllAsync_WhenNoTransactions_ShouldReturnEmptyList()
        {
            // Act
            var result = await _repository.GetAllAsync(_cancellationToken);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Is.Empty);
        }

        [Test]
        public async Task UpdateAsync_WithValidTransaction_ShouldReturnNumberOfUpdatedRecords()
        {
            // Arrange
            var originalTransaction = new Transaction(
                date: DateTime.Now.Date,
                description: "Original Description",
                unitPrice: 10.00m,
                quantity: 1
            );

            var transactionId = await _repository.AddAsync(originalTransaction, _cancellationToken);

            // Create updated transaction
            var updatedTransaction = new Transaction(
                date: DateTime.Now.Date.AddDays(1),
                description: "Updated Description",
                unitPrice: 25.50m,
                quantity: 3
            )
            {
                Id = transactionId
            };

            // Act
            var result = await _repository.UpdateAsync(updatedTransaction, _cancellationToken);

            // Assert
            Assert.That(result, Is.EqualTo(1)); // Should return 1 for one updated record

            // Verify the transaction was actually updated
            var savedTransaction = await _context.Set<Transaction>().FindAsync(transactionId);
            Assert.That(savedTransaction, Is.Not.Null);
            Assert.That(savedTransaction.Description, Is.EqualTo("Updated Description"));
            Assert.That(savedTransaction.UnitPrice, Is.EqualTo(25.50m));
            Assert.That(savedTransaction.Quantity, Is.EqualTo(3));
            Assert.That(savedTransaction.Total, Is.EqualTo(76.50m)); // 25.50 * 3
        }

        [Test]
        public async Task UpdateAsync_WithInvalidId_ShouldReturnZero()
        {
            // Arrange
            var invalidTransaction = new Transaction(
                date: DateTime.Now.Date,
                description: "Invalid ID Transaction",
                unitPrice: 15.00m,
                quantity: 1
            )
            {
                Id = -1 // Invalid ID
            };

            // Act
            var result = await _repository.UpdateAsync(invalidTransaction, _cancellationToken);

            // Assert
            Assert.That(result, Is.EqualTo(0));
        }

        [Test]
        public async Task Delete_WithExistingId_ShouldRemoveTransaction()
        {
            // Arrange
            var transaction = new Transaction(
                date: DateTime.Now.Date,
                description: "Transaction to Delete",
                unitPrice: 20.00m,
                quantity: 1
            );

            var transactionId = await _repository.AddAsync(transaction, _cancellationToken);

            // Verify transaction exists before deletion
            var existingTransaction = await _context.Transactions.FindAsync(transactionId);
            Assert.That(existingTransaction, Is.Not.Null);

            // Act
            await _repository.Delete(transactionId, _cancellationToken);

            // Assert
            var allTransactions = await _repository.GetAllAsync(_cancellationToken);
            Assert.That(allTransactions.Any(t => t.Id == transactionId), Is.False);
        }

        [Test]
        public async Task Delete_WithNonExistentId_ShouldNotThrow()
        {
            // Arrange
            int nonExistentId = 999;

            // Act & Assert
            // Should not throw an exception when trying to delete non-existent record
            Assert.DoesNotThrowAsync(() => _repository.Delete(nonExistentId, _cancellationToken));
        }

        [Test]
        public async Task Delete_MultipleTransactions_ShouldOnlyDeleteSpecifiedOne()
        {
            // Arrange
            var transaction1 = new Transaction(DateTime.Now.Date, "Transaction 1", 10.00m, 1);
            var transaction2 = new Transaction(DateTime.Now.Date, "Transaction 2", 20.00m, 1);
            var transaction3 = new Transaction(DateTime.Now.Date, "Transaction 3", 30.00m, 1);

            var id1 = await _repository.AddAsync(transaction1, _cancellationToken);
            var id2 = await _repository.AddAsync(transaction2, _cancellationToken);
            var id3 = await _repository.AddAsync(transaction3, _cancellationToken);

            // Act
            await _repository.Delete(id2, _cancellationToken);

            // Assert
            var remainingTransactions = await _repository.GetAllAsync(_cancellationToken);
            Assert.That(remainingTransactions, Has.Count.EqualTo(2));
            Assert.That(remainingTransactions.Any(t => t.Id == id1), Is.True);
            Assert.That(remainingTransactions.Any(t => t.Id == id2), Is.False); // Should be deleted
            Assert.That(remainingTransactions.Any(t => t.Id == id3), Is.True);
        }
    }
}
