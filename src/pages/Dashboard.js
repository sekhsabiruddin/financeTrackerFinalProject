import React, { useEffect } from "react";
import { useState } from "react";
//normal file import
import Header from "../components/Header";
import Cards from "../components/Cards";
import TransactionsTable from "../components/TransactionsTable";
import NoTransaction from "../components/NoTransaction";
import ChartComponet from "../components/Charts";
import Loader from "../components/Loading";
//fireabse file import
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { toast } from "react-toastify";
import { query, getDocs } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";

// import TransactionsTable from "../components/TransactionsTable";

function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);

  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIncomeModalVisible(true);
  };

  const handleIncomeCancel = () => {
    setIncomeModalVisible(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("On finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    // console.log("newTransaction ", newTransaction);
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      toast.success("Transaction added");
      let newArr = [...transactions]; // Create a new array
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.group(e);
      toast.error("Couldn't add transaction");
    }
  }

  // Fetch transactions on component mount and when the authenticated user changes
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Fetch transactions function
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        const transaction = doc.data();
        transaction.id = doc.id; // Include the 'id' property
        transactionsArray.push(transaction);
      });

      setTransactions(transactionsArray);
      // toast.success("Transactions Fetched");
    } else {
      setTransactions([]); // Set transactions to an empty array when user is null
    }
    setLoading(false);
  }

  // Calculate the balance whenever the transactions change
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;
    console.log("transactions value is", transactions);
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }
  //sort the Transaction
  let sortedTransaction = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  //delete data from table
  const deleteTransaction = async (transactionId) => {
    console.log("transaction Id", transactionId);
    try {
      // Delete the transaction from Firestore
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, transactionId));

      // Update the transactions state by filtering out the deleted transaction
      const updatedTransactions = transactions.filter(
        (transaction) => transaction.id !== transactionId
      );
      setTransactions(updatedTransactions);

      toast.success("Transaction deleted");
      console.log("deleted");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't delete transaction");
      console.log("not deleted");
    }
  };

  //eidt Transtion

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />
      )}
      {transactions.length !== 0 ? (
        <ChartComponet sortedTransaction={sortedTransaction} />
      ) : (
        <NoTransaction />
      )}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
      />
    </div>
  );
}

export default Dashboard;
