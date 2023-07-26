import React, { useState, useEffect } from "react";
import "./style.css";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Table, Input, Select, Space } from "antd";
import { onAuthStateChanged } from "firebase/auth";
// Check the correct path to firebase.js

import { collection, updateDoc } from "firebase/firestore";
import Papa from "papaparse";
import { Radio } from "antd";
import SearchImg from "../../assets/search.svg";
import "./style.css";
import Swal from "sweetalert2";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditIncomeModal from "../EditModal/editIncome";
import EditExpenseModal from "../EditModal/editExpense";
const { Option } = Select;

const TransactionsTable = ({
  transactions,
  onDeleteTransaction,
  setTransactions,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [singleData, setSingleData] = useState([{}]);
  const [user, setUser] = useState(null);
  const onFinish = async (values, type) => {
    console.log("valuestable page ", values);
    const transactionId = values.id;
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    try {
      // Assuming `user` is the currently logged-in user object containing the `uid`
      if (user && user.uid) {
        // Add the path to the user's transactions document
        const userTransactionsRef = collection(
          db,
          `users/${user.uid}/transactions`
        );

        // Get the specific transaction document you want to update
        const docRef = doc(userTransactionsRef, transactionId);

        // Perform the update operation with the new data
        await updateDoc(docRef, newTransaction);

        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, ...newTransaction }
              : transaction
          )
        );

        // Show a success message using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Transaction data updated successfully!",
        });

        console.log("Transaction data updated successfully!");
      }
    } catch (error) {
      console.error("Error updating transaction data:", error);
    }
  };

  // Delete confirmation
  const deleteTransaction = (transactionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion
        // Call the deleteTransaction function provided as prop
        onDeleteTransaction(transactionId);
      }
    });
  };

  const editFuncalities = (type) => {
    setEditMode(true);
    setSelectedTransaction(type);
  };

  const fetchSingleData = async (transactionId) => {
    try {
      if (user && user.uid && transactionId) {
        // Add null check for user object and uid property
        const docRef = doc(db, `users/${user.uid}/transactions`, transactionId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const transactionData = docSnapshot.data();
          const transactionWithId = { ...transactionData, id: transactionId };
          setSingleData(transactionWithId);
          // Perform any necessary logic with the transaction data
        } else {
          console.log("Transaction does not exist");
        }
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      fixed: "left",
      width: 120,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      width: 130,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 130,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, transaction) => {
        return (
          <Space>
            <EditOutlined
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => {
                fetchSingleData(transaction.id);
                editFuncalities(transaction.type);
              }}
            />

            <DeleteOutlined
              style={{ color: "red", marginLeft: "10px", cursor: "pointer" }}
              onClick={() => deleteTransaction(transaction.id)}
            />
          </Space>
        );
      },
    },
  ];


// Function for importing data from CSV
const importCSV = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const csvData = e.target.result;
    const parsedData = Papa.parse(csvData, { header: true });
    const importedTransactions = parsedData.data;

    // Here, you can handle the importedTransactions and update the database or state accordingly.
    console.log("Imported Transactions:", importedTransactions);
  };

  reader.readAsText(file);
};

  // Function for exporting to CSV
  function exportCSV() {
    var csv = Papa.unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const data = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction.csv";
    document.body.appendChild(link);
    link.click();
  }

  const components = {
    body: {
      cell: (props) => (
        <td
          style={{ fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}
          {...props}
        />
      ),
    },
  };

  const filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || item.type === typeFilter)
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  return (
    <div style={{ width: "100%" }}>
      <div
        className="-filter"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "1rem",
          flexWrap: "wrap",
          padding: "0 2rem",
        }}
      >
        <h2>My Transactions</h2>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
        <div
          className="csv-importexposrt-Btn"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "400px",
          }}
        >
          <button className="btn" onClick={exportCSV}>
            Export to CSV
          </button>
          <label htmlFor="file-csv" className="btn btn-blue">
            Import to CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            style={{ display: "none" }}
            onChange={importCSV} // Add onChange event to trigger importCSV function
          />
        </div>
      </div>
      <div className="my-table">
        <div className="search-select-option">
          <div className="input-flex">
            <img src={SearchImg} alt="" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
            />
          </div>
          <Select
            className="select-input"
            onChange={(value) => setTypeFilter(value)}
            value={typeFilter}
            placeholder="Filter"
          >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </div>

        <div className="main-table-data">
          <Table
            dataSource={sortedTransactions}
            columns={columns}
            components={components}
            scroll={{ x: 500 }} // Set a horizontal scroll for the table
          />
        </div>
      </div>
      {editMode && selectedTransaction === "income" && (
        <EditIncomeModal
          visible={editMode}
          onCancel={() => setEditMode(false)}
          singleData={singleData}
          onFinish={onFinish}
        />
      )}
      {editMode && selectedTransaction === "expense" && (
        <EditExpenseModal
          visible={editMode}
          onCancel={() => setEditMode(false)}
          singleData={singleData}
          onFinish={onFinish}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
