using ExpenseTracker.Domain;

namespace ExpenseTracker.Core.Services
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllAsync(CancellationToken cancellationToken);
        //Task<Transaction> GetById(int id);
        Task<int> AddAsync(Transaction transaction, CancellationToken cancellationToken);
        Task<int> UpdateAsync(Transaction transaction, CancellationToken cancellationToken);
        Task Delete(int id, CancellationToken cancellationToken);
    }
}
