// Create your BankAccount class here

class BankAccount {
    constructor(accountNumber, accountHolder) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = 0;
    }
    

// Enter your code here
deposit(amount) {
    this.balance += amount;
    console.log(`Deposited $${amount}. New balance: $${this.balance}`);
}

withdraw(amount) {
    if (amount <= this.balance) {
        this.balance -= amount;
        console.log(`Withdrawn $${amount}. New balance: $${this.balance}`);
    } else {
        console.log("Insufficient funds");
    }
}

checkBalance() {
    console.log(`Account Holder: ${this.accountHolder}`);
    console.log(`Account Number: ${this.accountNumber}`);
    console.log(`Current balance: $${this.balance}`);
    console.log(`---------------------------------`);
}

transferTo(account, amount) {
    if (amount <= this.balance) {
        this.balance -= amount;
        account.deposit(amount);
        console.log(`Transferred $${amount} to ${account.accountHolder}'s account.`);
        this.checkBalance();
        account.checkBalance();
    } else {
        console.log("Insufficient funds");
    }
}
}

// Example usage:
const account1 = new BankAccount("123456789", "John Doe");
account1.deposit(1000);
account1.checkBalance();

const account2 = new BankAccount("987654321", "Jane Smith");
account2.deposit(500);
account2.checkBalance();

account1.transferTo(account2, 200);
account1.checkBalance();
account2.checkBalance();

account2.withdraw(300);
account2.checkBalance();
