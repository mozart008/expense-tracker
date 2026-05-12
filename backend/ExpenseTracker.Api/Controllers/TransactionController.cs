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
        public async Task<IActionResult> GetTransactions(CancellationToken cancellationToken)
        {
            var transactions = await _transactionService.GetTransactionsAsync(cancellationToken);
            // Placeholder for getting transactions logic
            return Ok(transactions);
        }

        [HttpPost]
        public async Task<IActionResult> AddTransaction(TransactionDto transaction, CancellationToken cancellationToken)
        {
            await _transactionService.AddTransactionAsync(transaction, cancellationToken);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> EditTransaction(TransactionDto transaction, CancellationToken cancellationToken)
        {
            await _transactionService.EditTransactionAsync(transaction, cancellationToken);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id, CancellationToken cancellationToken)
        {
            await _transactionService.DeleteTransactionAsync(id, cancellationToken);
            return Ok();
        }
    }
}
