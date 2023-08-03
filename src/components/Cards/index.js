import React from "react";
import "./style.css";
import Button from "../Button";
import { Card, Row } from "antd";

function Cards({
  income,
  expense,
  totalBalance,
  showExpenseModal,
  showIncomeModal,
  fetchTransactions,
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  return (
    <div className="cards-container">
      <Row className="my-grid">
        <Card
          className="my-card totalBalance"
          title={<span style={{ color: "#fff" }}>Total Balance</span>}
        >
          <p>{formatCurrency(totalBalance)}</p>
        </Card>
        <Card className="my-card" title="Total Income">
          <p>{formatCurrency(income)}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className="my-card" title="Total Expenses">
          <p>{formatCurrency(expense)}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
