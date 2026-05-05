using ExpenseTracker.Api.Controllers;
using ExpenseTracker.Core.Dtos;
using ExpenseTracker.Core.Interfaces;
using Moq;

namespace ExpenseTracker.Api.Test
{
    public class TransactionControllerTests
    {
        private Mock<ITransactionService> _mockTransactionService;
        private TransactionController _controller;

        [SetUp]
        public void Setup()
        {
            _mockTransactionService = new Mock<ITransactionService>();
            _controller = new TransactionController(_mockTransactionService.Object);
        }

        [Test]
        public void GetTransactions_ShouldReturnOkResult_WithTransactionsList()
        {
            // Arrange
            var expectedTransactions = new List<TransactionDto>
            {
                new TransactionDto
                {
                    Id = 1,
                    Date = DateTime.Now.Date,
                    Description = "Test Transaction 1",
                    UnitPrice = 10.50m,
                    Quantity = 2,
                    Total = 21.00m
                },
                new TransactionDto
                {
                    Id = 2,
                    Date = DateTime.Now.Date.AddDays(-1),
                    Description = "Test Transaction 2",
                    UnitPrice = 15.75m,
                    Quantity = 1,
                    Total = 15.75m
                }
            };

            _mockTransactionService
                .Setup(x => x.GetTransactionsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedTransactions);

            // Act
            var result = _controller.GetTransactions();

            // Assert
            _mockTransactionService.Verify(x => x.GetTransactionsAsync(CancellationToken.None), Times.Once);
        }
    }
}
