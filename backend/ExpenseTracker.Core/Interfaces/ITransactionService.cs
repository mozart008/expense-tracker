using ExpenseTracker.Core.Dtos;

namespace ExpenseTracker.Core.Interfaces
{
    public interface ITransactionService
    {
        Task<List<TransactionDto>> GetTransactionsAsync(CancellationToken cancellationToken);
        Task<int> AddTransactionAsync(TransactionDto transaction, CancellationToken cancellationToken);
        Task<int> EditTransactionAsync(TransactionDto transaction, CancellationToken cancellationToken);
        Task DeleteTransactionAsync(int id, CancellationToken cancellationToken);
    }
}
