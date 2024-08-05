import React, { useState, useEffect } from "react";
//components
import Map from "@/src/components/map/Map";
import NaverMap from "@/src/components/map/NaverMap";
import Layout from "@/src/components/layout/Layout";
import CardShelf from "@/src/components/layout/CardShelf";
import Section from "@/src/components/layout/Section";
import LocationTab from "@/src/components/tab/LocationTab";
import TableContainer from "@/src/components/table/TableContainer";

export default function Home() {
  //지역 선택별 어린이집 리스트 배열 상태관리
  const [list, setList] = useState([]);
  //사용자가 선택한 어린이집 정보 상태관리
  const [selectedKider, setSelectedKinder] = useState({});

  //사용자가 시군구를 클릭하면 해당 시군구 코드를 업데이트
  const handleSigunCodeClick = (sigunCode) => {
    fetchKinderList(sigunCode);
  };

  const fetchKinderList = async (sigunCode) => {
    try {
      const response = await fetch(`/api/getTotalKdList?arcode=${sigunCode}`);
      const data = await response.json();
      setList(data.response.item);

      // setList(data.response.item);
    } catch (error) {
      console.error(error);
    }
  };

  //사용자가 선택한 어린이집 객체 정보 업데이트
  const handleKinderClickOnMap = (item) => {
    setSelectedKinder(item);
    console.log(item);
  };

  return (
    <>
      <Layout pageCalss="main">
        <CardShelf>
          <Section>
            {/* <ul>
              {list?.map((item, id) => {
                return <li key={id}>{item.craddr}</li>;
              })}
            </ul> */}
          </Section>
        </CardShelf>
        <CardShelf>
          <Section>
            <LocationTab onClick={handleSigunCodeClick} />
            <div>
              <NaverMap list={list} onClick={handleKinderClickOnMap} />
            </div>
          </Section>
          <Section>
            <TableContainer data={selectedKider} />
          </Section>
        </CardShelf>
      </Layout>
    </>
  );
}
