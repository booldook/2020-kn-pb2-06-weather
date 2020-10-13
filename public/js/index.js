/******************* 전역설정 ********************/
var appid = '02efdd64bdc14b279bc91d9247db4722';
var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
var sendData = { units: 'metric', lang: 'kr', appid: appid }

/************** 카카오 지도 연동 **************/
// 1. 지도를 화면에 생성한다.
// 2. 도시정보를 불러와서 openweathermap에 정보를 요청한다.
// 3. 콜백된 각 도시의 날씨정보를 기존에 생성한 지도에 나타낸다.
var container, options, map;
container = document.getElementById('map');
options = {
	center: new kakao.maps.LatLng(35.82, 127.44),
	level: 13
};
map = new kakao.maps.Map(container, options);
map.setDraggable(false);
map.setZoomable(false);
// map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

$.get('../json/city.json', onGetCity);
function onGetCity(r) {
	r.cities.forEach(function(v, i){
		sendData.lat = v.lat;
		sendData.lon = v.lon;
		$.get(dailyURL, sendData, onGetDaily);
		$("#city").append('<option value="'+v.id+'">'+v.name+'</option>');
	});
}
function onGetDaily(r) {
	//console.log(r);
	var icon = 'https://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	var html;
	if(r.id == 1835848 || r.id == 1841811) html = '<div class="custom-window lt">';
	else if(r.id == 1841066 || r.id == 1843564) html = '<div class="custom-window rt">';
	else html = '<div class="custom-window">';
	html += '<img src="'+icon+'" style="width: 40px;">';
	html += '<div>온도 <b>'+r.main.temp+'</b>℃<br>체감 <b>'+r.main.feels_like+'</b>℃</div>';
	html += '<img src="../img/triangle.png" class="triangle">'
	html += '</div>';
	var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon);
	var customWindow = new kakao.maps.CustomOverlay({
			position : position, 
			content : html
	});
	customWindow.setMap(map);
}

/************** 현재위치 날씨 정보 **************/
navigator.geolocation.getCurrentPosition(onGetPositon, onErrorPosition);
function onGetPositon(r) {
	sendData.lat = r.coords.latitude;
	sendData.lon = r.coords.longitude;
	$.get(dailyURL, sendData, onGetDailyWeather);
	$.get(weeklyURL, sendData, onGetWeeklyWeather);
}
function onErrorPosition(e) {
	console.log(e);
}
function onGetDailyWeather(r) {
	console.log(r);
	// YY/YYYY - M/MM - D/DD - H/HH(24시간제)/h/hh(12시간제) - m/mm
	var dtDate = moment(r.dt * 1000).format('M월 D일');
	var dtTime = moment(r.dt * 1000).format('H시 m분');
	$(".loc-wrapper .title-date").text(dtDate);
	$(".loc-wrapper .title-time").text(dtTime);
	var locTitle = r.name + ', ' + r.sys.country;
	$(".loc-wrapper .title-loc").text(locTitle);
	var icon = 'https://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	$(".cont-wrapper .icon-wrap img").attr("src", icon);

}
function onGetWeeklyWeather(r) {
	console.log(r);
}


/*
1. Daily content
- r.coord.lat 위도
- r.coord.lon 경도
- r.main.temp 온도
- r.main.feels_like 체감온도
- r.main.humidity 습도
- r.main.pressure 기압
- r.sys.sunrise 일출(ts)
- r.sys.sunset 일몰(ts)
-	r.weather[0].main 날씨 제목
-	r.weather[0].description 날씨 설명
- r.wind.deg
- r.wind.speed(m/s)
*/