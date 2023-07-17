import React, { useState } from "react";
import "./style.css";
import { Table, Input, Select, Space } from "antd";
import Papa from "papaparse";
import { Radio } from "antd";
import SearchImg from "../../assets/search.svg";
import "./style.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;

const TransactionsTable = ({ transactions }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",

      render: () => (
        <Space>
          <EditOutlined style={{ color: "green" }} />
          <DeleteOutlined style={{ color: "red", marginLeft: "10px" }} />
        </Space>
      ),
    },
  ];
  //it is for search and type
  const filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || item.type === typeFilter)
  );
  //it use for sorting
  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });
  //function exportCSV
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

  return (
    <div style={{ width: "100%", padding: "0rem 2rem" }}>
      <div
        className="my-table-filter"
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
            // allowClear
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
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
