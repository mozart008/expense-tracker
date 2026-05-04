using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Domain
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }


        public Transaction() { }

        // Use a constructor to force correct data entry
        public Transaction(DateTime date, string description, decimal unitPrice, int quantity)
        {
            Date = date;
            Description = description;
            UnitPrice = unitPrice;
            Quantity = quantity;
            Total = unitPrice * quantity;
        }
    }
}