using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Core.Dtos
{
    public class TransactionDto
    {
        public int? Id { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        public DateTime Date { get; set; }

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, 1000000.00, ErrorMessage = "Price must be greater than zero.")]
        public decimal UnitPrice { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "You must have at least 1 item.")]
        public int Quantity { get; set; }

        public decimal Total { get; set; }
    }
}