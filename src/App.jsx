import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [type, setType] = useState("expense");

  const [tranDate, setTranDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
    if (!category || !amount) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          tran_date: tranDate,
          type: type,
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
    setType("expense");

    setTranDate(
      new Date().toISOString().split("T")[0]
    );

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

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = transactions
    .filter(
      (item) =>
        item.type === "expense" ||
        item.type === null
    )
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance =
    totalIncome - totalExpense;

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
        รายรับ: {totalIncome.toFixed(2)} บาท
      </h2>

      <h2>
        รายจ่าย: {totalExpense.toFixed(2)} บาท
      </h2>

      <h2>
        คงเหลือ: {balance.toFixed(2)} บาท
      </h2>

      <hr />

      <div>
        <label>ประเภท</label>

        <br />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="expense">
            รายจ่าย
          </option>

          <option value="income">
            รายรับ
          </option>
        </select>
      </div>

      <br />

      <div>
        <label>วันที่</label>

        <br />

        <input
          type="date"
          value={tranDate}
          onChange={(e) =>
            setTranDate(e.target.value)
          }
        />
      </div>

      <br />

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
              <strong>
                {item.category}
              </strong>
            </div>

            <div>
              ประเภท :{" "}
              {item.type === "income"
                ? "รายรับ"
                : "รายจ่าย"}
            </div>

            <div>
              {Number(
                item.amount
              ).toFixed(2)}{" "}
              บาท
            </div>

            <div>
              {item.description}
            </div>

            <div>
              วันที่ : {item.tran_date}
            </div>

            <br />

            <button
              onClick={() =>
                deleteTransaction(
                  item.id
                )
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
