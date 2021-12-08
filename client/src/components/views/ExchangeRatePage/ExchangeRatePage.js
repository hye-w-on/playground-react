import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Input, Select } from "antd";

function ExchangeRatePage() {
  const [exchangeRate, setExchangeRate] = useState(1100);
  const [exchangeRateList, setExchangeRateList] = useState();
  const [country, setCountry] = useState("USD");
  const [rateEdit, setRateEdit] = useState(false);
  const [foreignCurrency, setForeignCurrency] = useState(0);
  const [krw, setKrw] = useState(0);

  useEffect(() => {
    Axios.get(
      "/koreaexim/site/program/financial/exchangeJSON?authkey=DHYwVp9lk9jbrWLi7VUoL8Lh3Jf6tD2P&searchdate=20211203&data=AP01"
    ).then((response) => {
      console.log(response);
      setExchangeRateList(response);
      for (let exchangeRate of exchangeRateList) {
        console.log(exchangeRate[2]);
      }
    });
  }, []);

  const onSelectCurruncy = (value) => {
    //antd 문법
    setCountry(value);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Select
          value={country}
          onChange={onSelectCurruncy}
          style={{ width: "100px" }}
        >
          <Select value="USD">
            <div>
              <span>🇺🇸 </span>
              USA
            </div>
          </Select>
          <Select value="EUR">
            <div>
              <span>🇪🇺 </span>
              유럽연합
            </div>
          </Select>
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
      <label htmlFor="currency">{country}</label>
      <Input
        allowClear
        style={{ width: "50%" }}
        id="currency"
        value={foreignCurrency}
        type="number"
        onChange={onChangeForeignCurrency}
        prefix="$"
        suffix="달러"
      />
      <label htmlFor="krw">KRW</label>
      <Input
        allowClear
        style={{ width: "50%" }}
        id="krw"
        value={krw}
        type="number"
        onChange={onChangeKRW}
        prefix="￦"
        suffix="원"
      />
    </div>
  );
}

export default ExchangeRatePage;
