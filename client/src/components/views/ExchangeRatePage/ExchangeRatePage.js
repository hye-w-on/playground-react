import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Input, Select,Table } from "antd";
import "./ExchangeRate.css";
const { Option } = Select;
const Country = [
  { countryName: "대한민국", curruncyCode: "KRW", curruncyName:"원", curruncySign: "￦", emoji:"🇰🇷" },
  { countryName: "USA", curruncyCode: "USD",  curruncyName:"달러", curruncySign: "$",  emoji:"🇺🇸" },
  { countryName: "유럽연합", curruncyCode: "EUR",  curruncyName:"유로", curruncySign: "€", emoji:"🇪🇺"},
];

function ExchangeRatePage() {
  const [exchangeRate, setExchangeRate] = useState(1100);
  const [exchangeRateList, setExchangeRateList] = useState([]);
  const [country, setCountry] = useState(Country[1]);
  const [rateEdit, setRateEdit] = useState(false);
  const [foreignCurrency, setForeignCurrency] = useState(0);
  const [krw, setKrw] = useState(0);
const columns = [
     {
    title: 'cur_nm',
    dataIndex: 'cur_nm',
  },
  {
    title: 'cur_unit',
    dataIndex: 'cur_unit',
  },
  {
    title: 'bkpr',
    dataIndex: 'bkpr',
  },
    {
    title: 'cur_unit',
    dataIndex: 'cur_unit',
  },
];
let data = [];

  useEffect(() => {
     Axios.get("api/exchange/getExchangeList").then((response) => {
      console.log(response.data);
      setExchangeRateList(response.data);
      for (let exchangeRate of exchangeRateList) {
        console.log(exchangeRate);
      }
    });
  }, []);

  const onSelectCurruncy = (value) => {
    //antd 문법
    let counrty = Country[value];
    setCountry(counrty);
  };

  const onChangeExchangeRate = (e) => {
    setExchangeRate(e.target.value);
  };
  const onChangeRateEdit = (e) => {
    setRateEdit((current) => !current);
    if (rateEdit) {
      setExchangeRate(1200);
    }
  };
  const onChangeForeignCurrency = (e) => {
    setForeignCurrency(e.target.value);
    setKrw(e.target.value * exchangeRate);
  };
  const onChangeKRW = (e) => {
    setKrw(e.target.value);
    setForeignCurrency(e.target.value / exchangeRate);
  };
  return (
  <div className="exchange-container">
    <div className="exchange-form">
      <br />
      <div className="exchangerate-edit">
        <Select
          onChange={onSelectCurruncy}
          style={{ width: "100px" }}
        >
       { Country.map((country,index) => (
          <Option key={index} value={index}>
            <div>
              <span>{country.emoji} </span>
              {country.countryName} 
            </div>
          </Option>
       ))
       }
        </Select>
        <Input
          allowClear
          style={{ width: "100%", margin: "5px" }}
          id="exchangeRate"
          value={exchangeRate}
          type="number"
          onChange={onChangeExchangeRate}
          disabled={!rateEdit}
        />
        <Button onClick={onChangeRateEdit} type={rateEdit ? "" : "primary"}>
          {rateEdit ? "취소" : "편집"}
        </Button>
      </div>
      <label htmlFor="currency">{country.curruncyCode}</label>
      <Input
        allowClear
        id="currency"
        value={foreignCurrency}
        type="number"
        onChange={onChangeForeignCurrency}
        prefix={country.curruncySign}
        suffix={country.curruncyName}
      />
      <label htmlFor="krw">KRW</label>
      <Input
        allowClear
        id="krw"
        value={krw}
        type="number"
        onChange={onChangeKRW}
        prefix="￦"
        suffix="원"
      />
    </div> 
       <Table columns={columns} dataSource={exchangeRateList}/>
 </div>
  );
}

export default ExchangeRatePage;
