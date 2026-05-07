using ExpenseTracker.Core.Dtos;
using ExpenseTracker.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            this._transactionService = transactionService;
        }

        [HttpGet]
        public IActionResult GetTransactions(CancellationToken cancellationToken)
        {
            var transactions = _transactionService.GetTransactionsAsync(cancellationToken);
            // Placeholder for getting transactions logic
            return Ok(transactions);
        }

        [HttpPost]
        public IActionResult AddTransaction(TransactionDto transaction, CancellationToken cancellationToken)
        {
            _transactionService.AddTransactionAsync(transaction, cancellationToken);
            return Ok();
        }

        [HttpPut]
        public IActionResult EditTransaction(TransactionDto transaction, CancellationToken cancellationToken)
        {
            _transactionService.EditTransactionAsync(transaction, cancellationToken);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction(int id, CancellationToken cancellationToken)
        {
            _transactionService.DeleteTransactionAsync(id, cancellationToken);
            return Ok();
        }
    }
}
