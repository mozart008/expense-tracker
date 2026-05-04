using ExpenseTracker.Core.Dtos;
using ExpenseTracker.Core.Services;
using ExpenseTracker.Core.Services.TransactionService;
using ExpenseTracker.Domain;
using Moq;

namespace ExpenseTracker.Core.Test;

public class TransactionServiceTests
{
    private Mock<ITransactionRepository> _mockRepository;
    private TransactionService _transactionService;

    [SetUp]
    public void Setup()
    {
        _mockRepository = new Mock<ITransactionRepository>();
        _transactionService = new TransactionService(_mockRepository.Object);
    }

    [Test]
    public async Task GetTransactionAsync_WithValidId_ReturnsTransactionDto()
    {// Arrange
        var transactions = new List<Transaction>
        {
            new Transaction
            {
                Id = 1,
                Date = DateTime.Now.Date,
                Description = "Test Transaction 1",
                UnitPrice = 10.50m,
                Quantity = 2,
                Total = 21.00m
            },
            new Transaction
            {
                Id = 2,
                Date = DateTime.Now.Date.AddDays(-1),
                Description = "Test Transaction 2",
                UnitPrice = 5.25m,
                Quantity = 3,
                Total = 15.75m
            }
        };

        _mockRepository.Setup(repo => repo.GetAllAsync(CancellationToken.None))
            .ReturnsAsync(transactions);

        // Act
        var result = await _transactionService.GetTransactionsAsync(CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Has.Count.EqualTo(2));

        Assert.That(result[0].Id, Is.EqualTo(1));
        Assert.That(result[0].Description, Is.EqualTo("Test Transaction 1"));
        Assert.That(result[0].UnitPrice, Is.EqualTo(10.50m));
        Assert.That(result[0].Quantity, Is.EqualTo(2));
        Assert.That(result[0].Total, Is.EqualTo(21.00m));

        Assert.That(result[1].Id, Is.EqualTo(2));
        Assert.That(result[1].Description, Is.EqualTo("Test Transaction 2"));
        Assert.That(result[1].UnitPrice, Is.EqualTo(5.25m));
        Assert.That(result[1].Quantity, Is.EqualTo(3));
        Assert.That(result[1].Total, Is.EqualTo(15.75m));
    }

    [Test]
    public async Task GetTransactionsAsync_WhenNoTransactions_ReturnsEmptyList()
    {
        // Arrange
        _mockRepository.Setup(repo => repo.GetAllAsync(CancellationToken.None))
            .ReturnsAsync(new List<Transaction>());

        // Act
        var result = await _transactionService.GetTransactionsAsync(CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.Empty);
    }

    [Test]
    public async Task AddTransactionAsync_WithValidTransaction_ReturnsTransactionId()
    {
        // Arrange
        var transactionDto = new TransactionDto
        {
            Date = DateTime.Now.Date,
            Description = "Test Expense",
            UnitPrice = 25.50m,
            Quantity = 2,
           Total = 51.00m
        };

        var expectedId = 123;
        _mockRepository.Setup(repo => repo.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedId);

        // Act
        var result = await _transactionService.AddTransactionAsync(transactionDto, CancellationToken.None);

        // Assert
        Assert.That(result, Is.EqualTo(expectedId));
        _mockRepository.Verify(repo => repo.AddAsync(
            It.Is<Transaction>(t =>
                t.Date == transactionDto.Date &&
                t.Description == transactionDto.Description &&
                t.UnitPrice == transactionDto.UnitPrice &&
                t.Quantity == transactionDto.Quantity &&
                t.Total == transactionDto.Total),
            CancellationToken.None), Times.Once);
    }

    [Test]
    public async Task AddTransactionAsync_WithNullTransaction_ThrowsArgumentNullException()
    {
        // Arrange
        TransactionDto nullTransaction = null;

        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async() => await _transactionService.AddTransactionAsync(nullTransaction, CancellationToken.None));

        Assert.That(ex.ParamName, Is.EqualTo("transactionDto"));
        _mockRepository.Verify(repo => repo.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task AddTransactionAsync_WithNegativeUnitPrice_ThrowsArgumentException()
    {
        // Arrange
        var transactionDto = new TransactionDto
        {
            Date = DateTime.Now.Date,
            Description = "Test Expense",
            UnitPrice = -10.00m,
            Quantity = 2,
            Total = -20.00m
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentException>(async () => await _transactionService.AddTransactionAsync(transactionDto, CancellationToken.None));

        Assert.That(ex.Message, Does.Contain("UnitPrice"));
        _mockRepository.Verify(repo => repo.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task AddTransactionAsync_WithZeroQuantity_ThrowsArgumentException()
    {
        // Arrange
        var transactionDto = new TransactionDto
        {
            Date = DateTime.Now.Date,
            Description = "Test Expense",
            UnitPrice = 25.50m,
            Quantity = 0,
            Total = 0m
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentException>(async() =>
            await _transactionService.AddTransactionAsync(transactionDto, CancellationToken.None));

        Assert.That(ex.Message, Does.Contain("Quantity"));
        _mockRepository.Verify(repo => repo.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task AddTransactionAsync_WhenRepositoryThrowsException_PropagatesException()
    {
        // Arrange
        var transactionDto = new TransactionDto
        {
            Date = DateTime.Now.Date,
            Description = "Test Expense",
            UnitPrice = 25.50m,
            Quantity = 2,
            Total = 51.00m
        };

        _mockRepository.Setup(repo => repo.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Database error"));

        // Act & Assert
        var ex = Assert.ThrowsAsync<InvalidOperationException>(async() =>
            await _transactionService.AddTransactionAsync(transactionDto, CancellationToken.None));

        Assert.That(ex.Message, Is.EqualTo("Database error"));
    }

    [Test]
    public async Task AddTransactionAsync_WithTransactionDtoHavingId_IgnoresIdInMapping()
    {
        // Arrange
        var transactionDto = new TransactionDto
        {
            Id = 999, // This should be ignored when creating new transaction
            Date = DateTime.Now.Date,
            Description = "Test Expense",
            UnitPrice = 25.50m,
            Quantity = 2,
            Total = 51.00m
        };

        var expectedId = 123;
        _mockRepository.Setup(repo => repo.AddAsync(It.IsAny<Transaction>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedId);

        // Act
        var result = await _transactionService.AddTransactionAsync(transactionDto, CancellationToken.None);

        // Assert
        Assert.That(result, Is.EqualTo(expectedId));
        _mockRepository.Verify(repo => repo.AddAsync(
            It.Is<Transaction>(t => t.Id == 0), // New entity should have Id = 0
            CancellationToken.None), Times.Once);
    }
}
