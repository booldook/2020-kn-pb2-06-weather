/******************* 전역설정 ********************/
var appid = '02efdd64bdc14b279bc91d9247db4722';
var dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
var weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
var sendData = { units: 'metric', lang: 'kr', appid: appid }

/************** 카카오 지도 연동 **************/
// 1. 지도를 화면에 생성한다.
// 2. 도시정보를 불러와서 openweathermap에 정보를 요청한다.
// 3. 콜백된 각 도시의 날씨정보를 기존에 생성한 지도에 나타낸다.
var container, options, map, mapCenter;
function mapInit() {
	container = document.getElementById('map');
	mapCenter = new kakao.maps.LatLng(35.82, 127.44);
	options = {
		center: mapCenter,
		level: 13
	};
	map = new kakao.maps.Map(container, options);
	map.setDraggable(false);
	map.setZoomable(false);
}
function onResize() {
	map.setCenter(mapCenter);
}
$(window).resize(onResize);
mapInit();


$.get('../json/city.json', onGetCity);
function onGetCity(r) {
	r.cities.forEach(function(v, i){
		sendData.id = null;
		sendData.lat = v.lat;
		sendData.lon = v.lon;
		$.get(dailyURL, sendData, function(res){
			onGetDaily(res, v.class);
		});
		$("#city").append('<option value="'+v.id+'">'+v.name+'</option>');
	});
}
function onGetDaily(r, cls) {
	var icon = 'https://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	var html;
	html = '<div id="c'+r.id+'" class="custom-window '+cls+'" onclick="onCustomClick('+r.id+');">';
	html += '<img src="'+icon+'" style="width: 40px;">';
	html += '<div>온도 <b>'+r.main.temp+'</b>℃<br>체감 <b>'+r.main.feels_like+'</b>℃</div>';
	html += '<img src="../img/triangle.png" class="triangle">'
	html += '</div>';
	var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon);
	var customWindow = new kakao.maps.CustomOverlay({
			position : position, 
			content : html,
			clickable: true,
	});
	customWindow.setMap(map);
}

/************** 현재위치 날씨 정보 **************/
navigator.geolocation.getCurrentPosition(onGetPositon, onErrorPosition);
function onGetPositon(r) {
	sendData.id = null;
	sendData.lat = r.coords.latitude;
	sendData.lon = r.coords.longitude;
	$.get(dailyURL, sendData, onGetDailyWeather);
	$.get(weeklyURL, sendData, onGetWeeklyWeather);
}
function onErrorPosition(e) {
	console.log(e);
}

/************** 페이지 새로고침 **************/
$(".bt-position").click(function(){
	location.reload();
});

/************** 도시정보 날씨 정보 **************/
$("#city").change(onGetCityWeather);
function onGetCityWeather() {
	sendData.lat = null;
	sendData.lon = null;
	sendData.id = $(this).val();
	$('.custom-window').removeClass("active");
	$('.custom-window').find(".triangle").attr("src", "../img/triangle.png");
	$("#c"+sendData.id).addClass("active");
	$("#c"+sendData.id).find(".triangle").attr("src", "../img/triangle-active.png");
	$.get(dailyURL, sendData, onGetDailyWeather);
	$.get(weeklyURL, sendData, onGetWeeklyWeather);
}

/************** 지도클릭 날씨 정보 **************/
function onCustomClick(id) {
	$("#city").val(id).trigger("change");
}

function windGen(deg) {
	if(deg > 345 || deg <= 15) return '북풍';
	else if(deg > 15 || deg <= 75) return '북동풍';
	else if(deg > 75 || deg <= 105) return '동풍';
	else if(deg > 105 || deg <= 165) return '남동풍';
	else if(deg > 165 || deg <= 195) return '남풍';
	else if(deg > 195 || deg <= 255) return '남서풍';
	else if(deg > 255 || deg <= 285) return '서풍';
	else if(deg > 285 || deg <= 345) return '북서풍';
	else return '';
}
/************** 현재날씨 콜백 **************/
function onGetDailyWeather(r) {
	// console.log(r);
	// YY/YYYY - M/MM - D/DD - H/HH(24시간제)/h/hh(12시간제) - m/mm
	var dtDate = moment(r.dt * 1000).format('M월 D일');
	var dtTime = moment(r.dt * 1000).format('H시 m분');
	$(".weather-wrapper .title-date").text(dtDate);
	$(".weather-wrapper .title-time").text(dtTime);
	var locTitle = r.name + ', ' + r.sys.country;
	$(".weather-wrapper .title-loc").text(locTitle);
	var icon = 'https://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	$(".daily-weather .icon-wrap img").attr("src", icon);
	var temp = r.main.temp;
	$(".daily-weather .temp").text(temp);
	var tempFeel = r.main.feels_like;
	$(".daily-weather .temp-feel").text(tempFeel);
	var descTitle = r.weather[0].main;
	$(".daily-weather .desc-title").text(descTitle);
	var desc = r.weather[0].description;
	$(".daily-weather .desc").text(desc);
	var humidity = r.main.humidity;
	$(".daily-weather .humidity").text(humidity);
	var pressure = r.main.pressure;
	$(".daily-weather .pressure").text(pressure);
	var sunrise = moment(r.sys.sunrise * 1000).format("HH시 mm분 ss초");
	$(".daily-weather .sunrise").text(sunrise);
	var sunset = moment(r.sys.sunset * 1000).format("HH시 mm분 ss초");
	$(".daily-weather .sunset").text(sunset);
	var windSpeed = r.wind.speed;
	$(".daily-weather .wind-speed").text(windSpeed);
	$(".daily-weather .wind").text(windGen(r.wind.deg));
}
function onGetWeeklyWeather(r) {
	console.log(r);
	var html = '', v = null;
	for(var i in r.list) {
		v = r.list[i];
		html 	= '<div class="slide swiper-slide">';
		html += '<div class="icon">';
		html += '<img src="https://openweathermap.org/img/wn/'+v.weather[0].icon+'@2x.png" alt="아이콘">';
		html += '</div>';
		html += '<div class="temp-wrap">';
		html += '<span class="temp">'+v.main.temp+'</span>℃ '; 
		html += '(체감: <span class="temp-feel">'+v.main.feels_like+'</span>℃)';
		html += '</div>';
		html += '<div class="press-wrap">';
		html += '기압: <span class="pressure">'+v.main.pressure+'</span>mmHg<br>';
		html += '습도: <span class="humidity">'+v.main.humidity+'</span>%';
		html += '</div>';
		html += '<div class="wind-wrap">';
		html += '바람: <span class="wind">'+windGen(v.wind.deg)+'</span>';
		html += '- <span class="wind-speed">'+v.wind.speed+'</span>m/s';
		html += '</div>';
		html += '<div class="time">'+moment(v.dt * 1000).format('M월 D일 H시 기준')+'</div>';
		html += '</div>';
		$(".weekly-weather .slide-wrapper").append(html);
	}
	var swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		freeMode: true,
		loopFillGroupWithBlank: true,
		navigation: {
			nextEl: '.bt-angle.bt-next',
			prevEl: '.bt-angle.bt-prev',
		},
	});
}


/*
1. Daily content
- r.main.temp 온도
- r.main.feels_like 체감온도
-	r.weather[0].main 날씨 제목
-	r.weather[0].description 날씨 설명
- r.main.humidity 습도
- r.main.pressure 기압
- r.sys.sunrise 일출(ts)
- r.sys.sunset 일몰(ts)
- r.wind.deg
- r.wind.speed(m/s)
- r.coord.lat 위도
- r.coord.lon 경도
*/