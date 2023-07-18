import React, { useState, useEffect } from "react";
import "./style.css";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Table, Input, Select, Space } from "antd";
import { onAuthStateChanged } from "firebase/auth";

import Papa from "papaparse";
import { Radio } from "antd";
import SearchImg from "../../assets/search.svg";
import "./style.css";
import Swal from "sweetalert2";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditIncomeModal from "../EditModal/editIncome";
import EditExpenseModal from "../EditModal/editExpense";
const { Option } = Select;

const TransactionsTable = ({ transactions, onDeleteTransaction }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [singleData, setSingleData] = useState([{}]);
  const [user, setUser] = useState(null);

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
    console.log(transactionId, "updateTransaction");
    // Fetch single transaction data from Firebase
    try {
      const docRef = doc(db, `users/${user.uid}/transactions`, transactionId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const transactionData = docSnapshot.data();
        console.log("Transaction data:", transactionData);
        setSingleData(transactionData);
        // Perform any necessary logic with the transaction data

        // Open the edit modal with the fetched data
        // showEditModal(transactionData);
      } else {
        console.log("Transaction does not exist");
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
      render: (_, transaction) => (
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
      ),
    },
  ];

  // ...rest of the code

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

  const handleEditIncome = (values) => {
    // Handle the update of income transaction
    // Update the transaction in Firebase or your desired data source
    console.log("Edit Income", values);
  };

  const handleEditExpense = (values) => {
    // Handle the update of expense transaction
    // Update the transaction in Firebase or your desired data source
    console.log("Edit Expense", values);
  };

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
          onFinish={handleEditIncome}
        />
      )}
      {editMode && selectedTransaction === "expense" && (
        <EditExpenseModal
          visible={editMode}
          onCancel={() => setEditMode(false)}
          singleData={singleData}
          onFinish={handleEditExpense}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
