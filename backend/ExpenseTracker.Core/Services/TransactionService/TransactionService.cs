using ExpenseTracker.Core.Dtos;
using ExpenseTracker.Core.Interfaces;
using ExpenseTracker.Domain;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Core.Services.TransactionService
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionService(ITransactionRepository transactionRepository)
        {
            this._transactionRepository = transactionRepository;
        }

        public async Task<int> AddTransactionAsync(TransactionDto transactionDto, CancellationToken cancellationToken)
        {
            if (transactionDto is null) throw new ArgumentNullException(nameof(transactionDto));

            if (transactionDto.UnitPrice < 0) throw new ArgumentException("UnitPrice cannot be negative.", nameof(transactionDto.UnitPrice));

            if (transactionDto.Quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.", nameof(transactionDto.Quantity));

            var transaction = new Transaction(
                transactionDto.Date, 
                transactionDto.Description, 
                transactionDto.UnitPrice, 
                transactionDto.Quantity
            );

            var id = await _transactionRepository.AddAsync(transaction, cancellationToken);

            return id;
        }

        public Task DeleteTransactionAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<int> EditTransactionAsync(TransactionDto transaction, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<List<TransactionDto>> GetTransactionsAsync(CancellationToken cancellationToken)
        {
            var transactions = await _transactionRepository.GetAllAsync(cancellationToken);

            var projectToDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Date = t.Date,
                Description = t.Description,
                UnitPrice = t.UnitPrice,
                Quantity = t.Quantity,
                Total = t.Total
            }).ToList();

            return projectToDtos;

        }
    }
}
