import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Converter() {
    const [currenciesCode, setCurrenciesCode] = useState([]);
    const [currencies, setCurrencies] = useState([])
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('inr');
    const [CurrencyData, setCurrencyData] = useState([]);
    const [toCurrency, setToCurrency] = useState('');
    const [conversionRate, setConversionRate] = useState();
    const [conversionResult, setConversionResult] = useState();
    const [transactionHistory, setTransactionHistory] = useState([]);



    const BASEAPI = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
    useEffect(() => {
        const fetchCurencies = async () => {
            try {
                const response = await axios.get(BASEAPI);
                console.log(Object.values(response.data))
                setCurrencies(response.data)
                setCurrenciesCode(Object.keys(response.data))

            } catch (error) {
                console.error('Error fetching conversion rate:', error);
            }
        };
        fetchCurencies();
    }, []);

    const fetchConversionRate = async () => {
        console.log(fromCurrency, toCurrency)
        try {

            const response = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`);
            console.log(response.data[fromCurrency])
            setCurrencyData(response.data[fromCurrency]);
            console.log(CurrencyData[toCurrency])
            setConversionRate(CurrencyData[toCurrency]);


        } catch (error) {
            console.error('Error fetching conversion rate:', error);
        }
    };

    useEffect(() => {
        fetchConversionRate();
    }, [fromCurrency, toCurrency]);

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleFromCurrencyChange = (e) => {
        setFromCurrency(e.target.value);
        setToCurrency('')
    };

    const handleToCurrencyChange = (e) => {
        setToCurrency(e.target.value);
    };

    const handleConvert = () => {
        const result = amount * conversionRate;
        setConversionResult(result.toFixed(2));

        const transaction = {
            fromCurrency,
            toCurrency,
            amount,
            result,
            timestamp: new Date().toISOString(),
        };

        setTransactionHistory([...transactionHistory, transaction]);
    };

    return (
        <div className="container mt-5">
            <h1>Currency Converter</h1>
            <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount:</label>
                <input type="number" className="form-control" id="amount" value={amount} onChange={handleAmountChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="fromCurrency" className="form-label">From Currency:</label>
                <select className="form-select" value={fromCurrency} onChange={handleFromCurrencyChange}>
                    {/* <option value=''>SelectValue</option> */}
                    {currenciesCode.map(currency => (
                        <option key={currency} value={currency}>{currencies[currency]}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="toCurrency" className="form-label">To Currency:</label>
                <select className="form-select" value={toCurrency} onChange={handleToCurrencyChange}>
                    {/* <option value=''>SelectValue</option> */}
                    {currenciesCode.map(currency => (
                        <option key={currency} value={currency}>{currencies[currency]}</option>
                    ))}
                </select>
            </div>
            <button className="btn btn-primary mb-3" onClick={handleConvert}>Convert</button>
            {conversionResult && <p>Conversion Result: {conversionResult}</p>}
            <h3>Transaction History</h3>
            <ul className="list-group">
                {transactionHistory.slice(-5).map((transaction, index) => (
                    <li key={index} className="list-group-item">
                        <div>From: {transaction.fromCurrency}</div>
                        <div>To: {transaction.toCurrency}</div>
                        <div>Amount: {transaction.amount}</div>
                        <div>Result: {transaction.result}</div>
                        <div>Timestamp: {transaction.timestamp}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
