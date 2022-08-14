function App() {
    //Anchor ReactJs
        const [countryData, setCountryData] = React.useState([]);
        const [widthOfBar, setWidthOfBar] = React.useState(5);
        const [dataType, setDataType] = React.useState("casesPerOneMillion")
    //Data Retrieved with async from json
        React.useEffect(()=> {
            async function fetchData() {
                const response = await fetch("https://disease.sh/v3/covid-19/countries?sort=" + dataType);
                const data = await response.json();
                console.log(data)
                setCountryData(data);
            }
            fetchData();
        }, [dataType]);
    
    
        return(
            <div>
                <h1>Covid Stats</h1>
                {/*Different Types for barchart arrangements, from cases per million to deaths etc*/}
                <select name="datatype" id="datatype"
                onChange={(e)=> setDataType(e.target.value)}
                value={dataType}
                >
                    <option value="casesPerOneMillion">Cases Per One Million</option>
                    <option value="cases">Cases</option>
                    <option value="deaths">Deaths</option>
                    <option value="tests">Tests</option>
                    <option value="deathsPerOneMillion">Deaths Per One Million</option>
                </select>
                <label htmlFor="widthofbar">
                    Width of bar:
                    <input 
                    type="number"
                    name="widthofbar"
                    value={widthOfBar}
                    onChange={(e)=> setWidthOfBar(e.target.value)} 
                    />
                </label>
            <div className="visHolder">
                {/*Barchart Function implemented from as child component*/}
                       <BarChart 
            data={countryData} 
            height={500} 
            widthOfBar={widthOfBar} 
            width={countryData.length * widthOfBar}
            dataType={dataType}
            />
            </div>
    
            </div>
        )
    };
    //Barchart Function to implement in parent function
    function BarChart ({data, height, width, widthOfBar, dataType}){
        React.useEffect(()=>{
            createBarChart();
        }, [data, widthOfBar])
    
        const createBarChart = () => {
    
            const countryData = data.map(country => country [dataType])
            const countries = data.map(country=> country.country);
    
            let tooltip = d3.select(".visHolder")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);
    
            const dataMax = d3.max(countryData);
            const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);
            d3.select("svg").selectAll("rect").data(countryData).enter().append("rect")
            d3.select("svg")
            .selectAll("rect")
            .data(countryData)
            .style("fill", (d, i)=> (i % 2 == 0 ? "#9595ff" : "44ff44"))
            .attr("x", (d, i)=> i * widthOfBar)
            .attr("y", (d) => height - yScale(d + dataMax * 0.1))
            .attr("height", (d, i)=> yScale(d + dataMax * 0.1))
            .attr("width", widthOfBar)
            .on("mouseover", (d, i)=> {
                tooltip.style("opacity", 0.9);
                tooltip.html(countries[i] + `<br/> ${dataType}: ` + d)
                .style("left", i * widthOfBar + 20 + "px")
                .style("top", d3.event.pageY -170 + "px")
            })
            .on("mouseout", (d)=> {
                tooltip.style("opacity", 0)
            })
        }
    
        return (
            <>
            <svg width={width} height={height}></svg>
            </>
        )
    }
    
    ReactDOM.render(<App/>, document.getElementById("root"))