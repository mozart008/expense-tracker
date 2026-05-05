using ExpenseTracker.Core.Interfaces;
using Microsoft.AspNetCore.Http;
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
        public IActionResult GetTransactions()
        {
            var transactions = _transactionService.GetTransactionsAsync(CancellationToken.None);
            // Placeholder for getting transactions logic
            return Ok(transactions);
        }
    }
}
