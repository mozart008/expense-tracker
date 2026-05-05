using ExpenseTracker.Core.Services;
using ExpenseTracker.Domain;
using ExpenseTracker.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Persistence
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;

        public TransactionRepository(ApplicationDbContext context)
        {
            this._context = context;
        }
        public async Task<int> AddAsync(Transaction transaction, CancellationToken cancellationToken)
        {
            _context.Add(transaction);

            await _context.SaveChangesAsync(cancellationToken);
            return transaction.Id;
        }

        public async Task Delete(int id, CancellationToken cancellationToken)
        {
            await _context.Transactions.Where(t => t.Id == id).ExecuteDeleteAsync(cancellationToken);
        }

        public async Task<List<Transaction>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Transactions.ToListAsync(cancellationToken);
        }

        public async Task<int> UpdateAsync(Transaction transaction, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
            //await _context.Transactions.Where(o => o.Id == transaction.Id)
            //    .ExecuteUpdateAsync(setters => setters.SetProperty(t => t.UnitPrice, transaction.UnitPrice), cancellationToken);
        }
    }
}
