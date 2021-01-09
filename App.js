import React, { Component } from 'react';
import {
    SafeAreaView, View, StyleSheet,
    Dimensions, ScrollView, Text,Button
} from 'react-native';
import {
    VictoryBar, VictoryChart, VictoryTheme, VictoryLabel, VictoryAxis, VictoryLine,
    VictoryContainer
} from "victory-native";
import { Swiper } from "react-native-swiper";
import { Svg } from 'react-native-svg'
// import { Configuration } from '../Configuration';
import Moment from 'moment';
import numeral from 'numeral';
import { ProgressBar, Colors } from 'react-native-paper';
// import { MenuWelcome } from '../components/MenuWelcome'
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataDoanhSo: [], dataDonHang: [], dataDoanhSoNhanVien: [], data: {} }
        debugger
    }

    componentDidMount() {
        debugger
        this.loadData();
    }

    componentWillUnmount() {
        this._getData();
    }

    loadData() {
        let fromDate = Moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('DD/MM/YYYY');
        let toDate = Moment(new Date()).format('DD/MM/YYYY');

        let employeeID = 1;
        let pharmacyID = 6;


        fetch('http://192.168.3.222:2233/api/api_hethong/get_bieudo_sodonhang_mobile?pharmacyID=' + pharmacyID + '&employeeID=' + employeeID + '&tungay=' + fromDate + '&denngay=' + toDate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }).then(response => response.json())
            .then(responseJson => {
                debugger
                if (responseJson) {
                    if (responseJson.doanhso && responseJson.doanhso.length > 0) {
                        let dataDoanhSo = [];
                        let doanhso = responseJson.doanhso;
                        for (var i = 0; i < doanhso.length; i++) {
                            dataDoanhSo.push({ x: doanhso[i].NgayString, y: doanhso[i].TongTien, ChiTiet: doanhso[i].ChiTiets });
                        }
                        this.setState({ dataDoanhSo: dataDoanhSo, dataDoanhSoNhanVien: responseJson.doanhso[doanhso.length - 1].ChiTiets });
                    }

                    if (responseJson.donhang && responseJson.donhang.length > 0) {
                        let dataDonHang = [];
                        let donhang = responseJson.donhang;
                        for (var i = 0; i < donhang.length; i++) {
                            dataDonHang.push({ x: donhang[i].NgayString, y: donhang[i].SoDonHang });
                        }
                        this.setState({ dataDonHang: dataDonHang });
                    }
                }
            });
    }



    render() {
        const CustomLabel = (props) => (
            <View
                style={{
                    position: 'absolute',
                    left: props.x,
                    top: props.y - 20,
                }}>
                <Text style={{ backgroundColor: '#63bdf1' }}>{props.datum.y}</Text>
            </View>
        );

        const randomColor = () => {
            var allowed = "0369cf".split(''), s = "#";
            while (s.length < 4) {
                s += allowed.splice(Math.floor((Math.random() * allowed.length)), 1);
            }
            return s;
        }

        const setDoanhSoNhanVien = (data) => {
            this.setState({ dataDoanhSoNhanVien: data });
        }

        let doanhsoNhanVien = this.state.dataDoanhSoNhanVien;
        let progressDSNV = <></>;
        if (doanhsoNhanVien.length > 0) {
            progressDSNV = doanhsoNhanVien.map((x) => {
                let tongtien = doanhsoNhanVien.map((x) => x.TongTien).reduce((a, b) => a + b, 0);
                let progressValue = +(x.TongTien / tongtien).toFixed(2);
                let colorRandom = randomColor();
                return (<View style={styles.viewProgressContainer}>
                    <View style={styles.viewProgressText}>
                        <Text>{x.Name}</Text>
                        <Text>{numeral(x.TongTien).format('0,0')}/{numeral(tongtien).format('0,0')}</Text>
                    </View>
                    <ProgressBar style={{ height: 10 }} progress={progressValue} color={colorRandom} />
                </View>)
            })
        }

        return (
            <SafeAreaView style={styles.container}>
                {/* <MenuWelcome title="Bảng điều khiển" /> */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <View>
                        <Text style={styles.textStyle}>Thống kê dược</Text>
                        <View>
  <View style={{justifyContent: 'center',display: 'flex'}}>
      <View
        style={{
          backgroundColor: 'red',
          height: 70,
          width:70
        }}>
        <Text style={{ color: 'white' }}>Test</Text>
      </View>
      <View
        style={{
          backgroundColor: 'green',
          height: 70,
          width:70
        }}>
        <Text style={{ color: 'white' }}>Test</Text>
      </View>
  </View>
</View>
                        <Text style={styles.textStyle}>(1) Thống kê doanh số</Text>
                        <Svg width={Dimensions.get("window").width}>
                            <VictoryChart theme={VictoryTheme.material} containerComponent={<VictoryContainer disableContainerEvents />}>
                                <VictoryAxis
                                    tickLabelComponent={<VictoryLabel angle={45} />}
                                    style={{
                                        axis: { stroke: 'grey' },
                                        tickLabels: { fontSize: 10, padding: 3, marginLeft: 10, verticalAnchor: "middle", textAnchor: 'start' }
                                    }}
                                />
                                <VictoryAxis
                                    tickFormat={(d) => numeral(d).format('0.0a')}
                                    dependentAxis
                                />
                                <VictoryBar data={this.state.dataDoanhSo} labels={({ datum }) => numeral(datum.y).format('0,0')}
                                    style={{ labels: { fill: "#000" }, data: { fill: ({ datum }) => randomColor() } }}
                                    labelComponent={<VictoryLabel dy={0} />}
                                    events={[{
                                        target: "data",
                                        eventHandlers: {
                                            onPress: (d) => {
                                                return [
                                                    {
                                                        mutation: (props) => {
                                                            if (props && props.datum.ChiTiet) {
                                                                setDoanhSoNhanVien(props.datum.ChiTiet);
                                                            }
                                                        }
                                                    }]
                                            }
                                        }
                                    }]}
                                />
                            </VictoryChart>
                        </Svg>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={{ ...styles.textStyle }}>(2)Doanh số nhân viên theo ngày</Text>
                        <View style={{ marginTop: 20 }}>
                            {progressDSNV}
                        </View>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.textStyle}>(3)Thống kê số đơn hàng</Text>
                        <VictoryChart
                            theme={VictoryTheme.material}>
                            <VictoryAxis
                                tickLabelComponent={<VictoryLabel angle={45} />}
                                style={{
                                    axis: { stroke: 'grey' },
                                    tickLabels: { fontSize: 10, padding: 3, marginLeft: 10, verticalAnchor: "middle", textAnchor: 'start' }
                                }}
                            />
                            <VictoryAxis
                                tickFormat={(d) => d}
                                dependentAxis
                            />
                            <VictoryLine
                                style={{ data: { fill: ({ datum }) => randomColor() } }}
                                data={this.state.dataDonHang}
                                labels={({ datum }) => numeral(datum.y).format('0,0')}
                                labelComponent={<CustomLabel />}
                                renderInPortal
                            />
                        </VictoryChart>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5fcff"
    },
    textStyle: {
        fontSize: 18,
        marginLeft: 5,
        fontWeight: "bold",
        color:'green'
    },
    viewProgressContainer: {
        marginLeft: 5, marginRight: 5
    },
    viewProgressText: { flexDirection: 'row', justifyContent: "space-between" }
});