using ExpenseTracker.Core.Services;
using ExpenseTracker.Domain;
using ExpenseTracker.Domain.Exceptions;
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

        public async Task<Transaction> UpdateAsync(Transaction transaction, CancellationToken cancellationToken)
        {
            var existingTransaction = await _context.Transactions.FindAsync(transaction.Id);

            if (existingTransaction is null) 
                throw new BadRequestException($"Transaction Id: {transaction.Id} does not exists.");

            existingTransaction.Date = transaction.Date;
            existingTransaction.Description = transaction.Description;
            existingTransaction.UnitPrice = transaction.UnitPrice;
            existingTransaction.Quantity = transaction.Quantity;
            existingTransaction.Total = transaction.Total;

            await _context.SaveChangesAsync(cancellationToken);
            return existingTransaction;
        }
    }
}
