import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Button, Input, Select, Table, Tag } from "antd";
import CountryList from "./CountryList";
import "./ExchangeRate.css";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const { Option } = Select;

function ExchangeRatePage() {
  const [exchangeRate, setExchangeRate] = useState(1100);
  const [exchangeRateList, setExchangeRateList] = useState([]);
  const [country, setCountry] = useState(CountryList[1]);
  const [rateEdit, setRateEdit] = useState(false);
  const [foreignCurrency, setForeignCurrency] = useState(0);
  const [krw, setKrw] = useState(0);
  const columns = [
    {
      title: "",
      dataIndex: "emoji",
    },
    {
      title: "국가",
      key: "countryName",
      dataIndex: "countryName",
    },
    {
      title: "통화명",
      key: "curruncyName",
      dataIndex: "curruncyName",
    },
    {
      title: "통화코드",
      dataIndex: "cur_unit",
    },
    {
      title: "매매 기준율",
      dataIndex: "deal_bas_r",
    },
    {
      title: "전일대비",
      key: "netChange",
      dataIndex: "netChange",
      render: (netChange, curruncyName) => (
        <div>
          {netChange < 0 ? (
            <Tag color="red" key={curruncyName}>
              <CaretDownOutlined /> {netChange}
            </Tag>
          ) : (
            <Tag color="blue" key={curruncyName}>
              <CaretUpOutlined /> {netChange}
            </Tag>
          )}
        </div>
      ),
    },
  ];
  let data = [];

  useEffect(() => {
    let neweExchangeList = [];
    Axios.get(
      "https://rhv2mfccrf.execute-api.ap-northeast-2.amazonaws.com/prod/exchange/20211208"
    ).then((exchangeList) => {
      Axios.get("api/exchange/getPreExchangeList").then((preExchangeList) => {
        //netChange 계산
        for (let i = 0; i < exchangeList.data.length; i++) {
          if (
            preExchangeList.data[i].cur_unit == exchangeList.data[i].cur_unit
          ) {
            let netChange = (
              preExchangeList.data[i].deal_bas_r.replace(/\,/g, "") -
              exchangeList.data[i].deal_bas_r.replace(/\,/g, "")
            ).toFixed(2);
            Object.assign(exchangeList.data[i], { netChange: netChange });
          } else {
            alert("netChange error");
          }
        }
        //Country join
        let key = -1;

        for (let country of CountryList) {
          let exchangeObj = exchangeList.data.filter(
            (row) => row.cur_unit == country.cur_unit
          );
          key = key + 1;
          let cur_nm = exchangeObj[0].cur_nm.split(" ");
          if (cur_nm[0] == "위안화") {
            cur_nm[0] = "중국";
            cur_nm[1] = "위안";
          }
          if (cur_nm[0] == "유로") {
            cur_nm[0] = "유럽연합";
            cur_nm[1] = "유로";
          }
          let exchangeRate = {
            key: key,
            countryName: cur_nm[0],
            curruncyName: cur_nm[1],
          };
          Object.assign(exchangeRate, country, exchangeObj[0]);
          neweExchangeList.push(exchangeRate);
          exchangeList.data.splice(
            exchangeList.data.indexOf(exchangeObj[0]),
            1
          );
        }
        //Others
        for (let data of exchangeList.data) {
          key = key + 1;
          let cur_nm = data.cur_nm.split(" ");
          let exchangeRate = {
            key: key,
            countryName: cur_nm[0],
            curruncyName: cur_nm[1],
          };
          Object.assign(exchangeRate, data);
          neweExchangeList.push(exchangeRate);
        }
        setExchangeRateList(neweExchangeList);
      });
    });
  }, []);

  const onSelectCurruncy = (value) => {
    //antd 문법
    let counrty = exchangeRateList[value];
    setCountry(counrty);
    setExchangeRate(counrty.deal_bas_r.replace(/\,/g, ""));
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
            value={country.countryName}
            onChange={onSelectCurruncy}
            style={{ width: "100px" }}
          >
            {exchangeRateList.map((country, index) => (
              <Option key={country.countryName} value={index}>
                {country.countryName}
              </Option>
            ))}
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
        <label htmlFor="currency">{country.cur_unit}</label>
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
      <Table
        columns={columns}
        dataSource={exchangeRateList}
        size="middle"
        scroll={{ y: "500px" }}
        style={{ width: "500px" }}
        pagination={{ defaultPageSize: 50, position: ["none", "none"] }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              let exchange = record.deal_bas_r.replace(/\,/g, "");
              setExchangeRate(exchange);
              setCountry(record);
            },
          };
        }}
      />
    </div>
  );
}

export default ExchangeRatePage;
