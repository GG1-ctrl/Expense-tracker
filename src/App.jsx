import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setTransactions(data);
    }
  }

  async function saveTransaction() {
    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          tran_date: new Date()
            .toISOString()
            .split("T")[0],
          category: category,
          amount: Number(amount),
          description: description,
        },
      ]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("บันทึกข้อมูลสำเร็จ");

    setCategory("");
    setAmount("");
    setDescription("");

    loadTransactions();
  }

  async function deleteTransaction(id) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadTransactions();
  }

  const totalExpense = transactions.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Expense Tracker</h1>

      <h2>
        ยอดรวมรายจ่าย: {totalExpense.toFixed(2)} บาท
      </h2>

      <div>
        <label>หมวดหมู่</label>
        <br />
        <input
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>จำนวนเงิน</label>
        <br />
        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>รายละเอียด</label>
        <br />
        <input
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      <br />

      <button onClick={saveTransaction}>
        บันทึก
      </button>

      <hr />

      <h2>รายการทั้งหมด</h2>

      {transactions.length === 0 ? (
        <p>ยังไม่มีข้อมูล</p>
      ) : (
        transactions.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong>{item.category}</strong>
            </div>

            <div>
              {Number(item.amount).toFixed(2)} บาท
            </div>

            <div>
              {item.description}
            </div>

            <div>
              วันที่: {item.tran_date}
            </div>

            <br />

            <button
              onClick={() =>
                deleteTransaction(item.id)
              }
            >
              ลบ
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;