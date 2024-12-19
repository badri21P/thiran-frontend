import { useState } from "react";
import axios from "axios";

const url = "http://localhost:3000/api/v1";

const App = () => {
	const [country, setCountry] = useState<string>("India");
	const [units, setUnits] = useState<number>(10);
	const [result, setResult] = useState<string>(
		"Click Calculate to see the result",
	);
	const [n, setN] = useState<number | string>("");
	const [combinations, setCombinations] = useState<string[]>([]);

	const handleCalculate = async () => {
		try {
			const response = await axios.post(`${url}/calculate`, {
				country: country.toLowerCase(),
				units,
			});
			const { totalCost, stockIndia, stockSriLanka } = response.data;
			setResult(`
        Minimum Cost: ${totalCost} <br />
        Stock left in India: ${stockIndia} <br />
        Stock left in Sri Lanka: ${stockSriLanka}
      `);
      // await handleReset();
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			setResult(error.response?.data?.error || "Something went wrong.");
		}
	};

	const handleReset = async () => {
		try {
			await axios.post(`${url}/reset`);
			setUnits(10);
			setResult("Click Calculate to see the result");
		} catch {
			setResult("Failed to reset.");
		}
	};

	const handleGenerate = async () => {
		const num = Number(n);
		if (typeof num !== "number" || num <= 0 || num > 10) {
      // Added 10 as limit to prevent too much recursion
			alert("Please enter a valid positive number");
			return;
		}
		const response = await axios.post(`${url}/q2`, {
			number: num,
		});
		// console.log(response.data);
		const { result } = response.data;
		setCombinations(result);
	};

	return (
		<div>
			<div className="container">
				<h1>iPod Order Calculator</h1>
				<label>Select Country:</label>
				<select value={country} onChange={(e) => setCountry(e.target.value)}>
					<option value="India">India</option>
					<option value="SriLanka">Sri Lanka</option>
				</select>
				<br />
				<br />
				<label>Number of Units:</label>
				<button onClick={() => setUnits(Math.max(10, units - 10))}>-</button>
				<span className="units">{units}</span>
				<button onClick={() => setUnits(units + 10)}>+</button>
				<br />
				<br />
				<button onClick={handleCalculate}>Calculate</button>
				<button onClick={handleReset}>Reset</button>
				<div
					className="result"
					style={{
						marginTop: "20px",
						padding: "10px",
						border: "1px solid #ccc",
						backgroundColor: "#f9f9f9",
					}}
					dangerouslySetInnerHTML={{ __html: result }}
				/>
			</div>
			<div className="container">
				<h1>Balanced Braces Generator</h1>
				<input
					type="number"
					placeholder="Enter n (e.g., 3)"
					value={n}
					onChange={(e) => setN(e.target.value)}
					style={{
						padding: "10px",
						fontSize: "16px",
						marginRight: "10px",
						width: "200px",
					}}
				/>
				<button
					onClick={handleGenerate}
					style={{
						padding: "10px 20px",
						fontSize: "16px",
						cursor: "pointer",
						backgroundColor: "#007bff",
						color: "#fff",
						border: "none",
						borderRadius: "4px",
					}}
				>
					Generate
				</button>
				<div
					style={{
						marginTop: "20px",
						textAlign: "left",
						width: "50%",
						margin: "20px auto",
					}}
				>
					<h2>Combinations:</h2>
					<ul>
						{combinations.map((combo, index) => (
							<li key={index} style={{ fontSize: "16px", lineHeight: "1.5" }}>
								{combo}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default App;
