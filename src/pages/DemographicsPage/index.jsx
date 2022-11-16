import { CardHP, CardHPP, CardHPH, CardHIP, InnerNav } from "../../components";
import "./demoPage.css";
import { useState, useEffect } from "react";
import greetings from "../../assets/greetings";

import { motion, AnimatePresence } from "framer-motion";

export default function DemographicsPage({ navSearchSearching, motto }) {
  const [isLoading, setIsLoading] = useState(true);
  const [religionData, setReligionData] = useState([]);
  const [raceData, setRaceData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [sexData, setSexData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  let boroughName = sessionStorage.getItem("borough");
  useEffect(() => {
    async function getBoroughInfo() {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/demographics/${boroughName}/religion`
      );
      const rawDataReligion = await response.json();
      const ethnicityResponse = await fetch(
        `http://localhost:3000/demographics/${boroughName}/ethnicity`
      );
      const ethnicityResponseData = await ethnicityResponse.json();

      const ageResponse = await fetch(
        `http://localhost:3000/demographics/${boroughName}/age`
      );
      const rawDataAge = await ageResponse.json();
      const sexResponse = await fetch(
        `http://localhost:3000/demographics/${boroughName}/sex`
      );
      const rawDataSex = await sexResponse.json();
      const langResponse = await fetch(
        `http://localhost:3000/summary/${boroughName}`
      );
      const rawDataLang = await langResponse.json();
      setReligionData(rawDataReligion);
      setRaceData(ethnicityResponseData);
      setAgeData(rawDataAge);
      setSexData(rawDataSex);
      setIsLoading(false);
      setSummaryData(rawDataLang);
    }

    getBoroughInfo();
  }, [navSearchSearching]);

  const getGreeting = (lang) => {
    const hello = greetings.filter((greeting) => greeting.language == lang);
    const secondLanguageHello = hello[0].hello;
    return secondLanguageHello;
  };

  let secondReligion;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function biggestReligion() {
    let arr = religionData;
    console.log(arr);

    if (
      arr["data"][1]["category"] != "no_religion" &&
      arr["data"][1]["category"] != "other_religion"
    ) {
      secondReligion = arr["data"][1]["category"];
    } else if (
      arr["data"][2]["category"] != "no_religion" &&
      arr["data"][2]["category"] != "other_religion"
    ) {
      secondReligion = arr["data"][2]["category"];
    } else if (
      arr["data"][3]["category"] != "no_religion" &&
      arr["data"][3]["category"] != "other_religion"
    ) {
      secondReligion = arr["data"][3]["category"];
    }
    console.log("second largest religion is", secondReligion);
    let capitalizedReligion = capitalizeFirstLetter(secondReligion);
    return capitalizedReligion;
  }

  let secondPopularRace;

  function secondRace() {
    let arr = raceData;
    if (
      arr["data"][0]["category"] != "white" &&
      arr["data"][0]["category"] != "other"
    ) {
      secondPopularRace = arr["data"][0]["category"];
    } else if (
      arr["data"][1]["category"] != "white" &&
      arr["data"][1]["category"] != "other"
    ) {
      secondPopularRace = arr["data"][1]["category"];
    } else {
      secondPopularRace = arr["data"][2]["category"];
    }

    let capitalizedRace = capitalizeFirstLetter(secondPopularRace);
    return capitalizedRace;
  }

  function ageFormatting(age) {
    switch (age) {
      case "a0_9":
        return "0-9";
        break;
      case "a10_17":
        return "10-17";
        break;
      case "a18_26":
        return "18-26";
        break;
      case "a27_35":
        return "27-35";
        break;
      case "a36_44":
        return "36-44";
        break;
      case "a45_53":
        return "45-53";
        break;
      case "a54_62":
        return "54-62";
        break;
      case "a63_71":
        return "63-71";
        break;
      case "a72_80":
        return "72-80";
        break;
      case "a81_":
        return "81+";
    }
    return age;
  }

  // secondBiggestReligion();

  // console.log(getGreeting("Polish"));

  if (isLoading === false) {
    return (

      <AnimatePresence>
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="six-tile-wrapper"
        >

          <CardHPH
            className={"pink six-tile"}
            heading={"Language"}
            secondaryInfo={`The majority of people speak English but did you know the second most commonly spoken language in ${religionData["borough_name"]} is ${summaryData["second_lang"]}!`}
            primaryInfo={`${getGreeting(summaryData["second_lang"])} 👋`}
          />
          <CardHIP

            className={'blue six-tile'}
            heading={'Race'}
            dataResponse={raceData}
            chartType={'donut'}
            secondaryInfo={`${religionData["borough_name"]} is home to a large ${secondRace()} community. Be sure to check out ${
                summaryData["checkout"]
              }`}

          />
          <CardHIP
            className={"yellow six-tile house-type"}
            heading={"House Type"}
            secondaryInfo={"Here's what the makeup of houses tend to look like"}

            
          />
          <CardHIP
            className={"pink six-tile"}
            heading={"Religion"}
           chartType={'donut'}
            dataResponse={religionData}
            secondaryInfo={`The largest religious group identify as ${biggestReligion()}. However, expect to see ${
              summaryData["expect"]
            } `}
          />
          <CardHP
            className={"blue six-tile age"}
            heading={"Age"}
            secondaryInfo={`The majority of people living in ${
              religionData["borough_name"]
            } are aged ${ageFormatting(
              ageData["data"][0]["category"]
            )}, with the second highest proportion of people aged ${ageFormatting(
              ageData["data"][1]["category"]
            )}.`}
          />
          <CardHPP
            className={"yellow six-tile"}

            heading={"Sex"}
            primaryInfo={`${100 < sexData["data"][0]["value"] ? "🙋‍♂️" : "🙋‍♀️"}`}
            secondaryInfo={`There are ${sexData["data"][0]["value"]} males to every 100 females!`}
          />
        </motion.div>

      </AnimatePresence>

    );
  } // else {
  //   return (
  //     <div className="page-wrapper">
  //       <h1>Borough Info is loading...</h1>
  //       <h3 className="motto">
  //         <em>"We Serve"</em>
  //       </h3>
  //       <InnerNav />
  //       <div className="wellbeing-wrapper"></div>
  //     </div>
  //   );
  // }
}
