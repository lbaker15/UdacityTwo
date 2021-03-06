let store = Immutable.Map({ 
    user: Immutable.Map({ name: "Lael" }),
    apod: '',
	roverName: ['Curiosity', 'Opportunity', 'Spirit'],
	chosenRover: '',
	data: [],
	dataLink: [],
	dataDate: [],
	landing: '',
	status: '',
	launch: '',
	camera: '',
	overlay: '',
	maxDate: [],
	loaded: false,
	apodImage: '',
	smallLoading: false
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// create content
const App = (state) => {
    let { rover } = state
	let loaded = store.get("loaded");
    return `
		${loader()}
		<div class="fullCover">
			${processImageOfTheDay(store.get("apod"))}
		</div>	 
		<header>
			${Greeting(store.get("user").get("name"))}
			${apodBtn(store.get("apod"))}
			${buttons(store.roverName)}
				${addTwo(createFull)}
				${rocks()}
			</div>		
			${oneSection()}
		</div>
		</header>
     `

}
//Loader
const loader = () => {
	const loaded = store.get("loaded")
	if (loaded === false) {
		return `
		<div class="loader">
		Loading...
		</div>
		`
	} else {
		return ``
	}
}
//Rock animation
const rocks = () => {
	const loaded = store.get("loaded")
	if (loaded === true) {
	if (store.get("chosenRover") == '') {
		return `
				<div class="rocks">
					<img class="smallR" src="smallRock.png">
					<img class="smallRTwo" src="smallRock.png">
					<img class="largeR" src="largeRock.png">
					<img class="miniR" src="smallRock.png">
					<img class="miniRTwo" src="smallRock.png">
					<img class="miniRThree" src="smallRock.png">
				</div>
			`
	} else {
		return `
			<div class="rocksHigherUp">
				<img class="smallRHigh" src="smallRock.png">
				<img class="smallRTwoHigh" src="smallRock.png">
				<img class="largeRHigh" src="largeRock.png">
				<img class="miniRHigh" src="smallRock.png">
				<img class="miniRTwoHigh" src="smallRock.png">
				<img class="miniRThreeHigh" src="smallRock.png">
			</div>
		`
	}
	} else {
		return ``
	}
}
//Processing apod info to create background image
const processImageOfTheDay = (apod) => {
	if (apod == '') {
		getImageOfTheDay(apod);
	} else {
		const apodImg = Array.from(Array.from(apod).flat()[1])
		const apodMedia = (apodImg.filter(function(x, i){
			return x.includes("media_type")
		})).flat()[1];
		if (apodMedia == 'video') {
			let apodImgPrint = (apodImg.filter(function(x, i){
				return x.includes('url')
			})).flat()[1];
			return `
				<div class="bgImg" style="background-image: url(b.jpg);background-size: cover;">
			`
		} else if (apodMedia == 'image') {	
			const apodImage = apodImg.filter(function(x, i){
				return x.includes('url')
			}).flat()[1]
			return `
				<div class="bgImg" style="background-image: url(${apodImage}); background-size: cover;">
			`
		} else {
			return ` `
		}
	}
}
//Creating content of apod overlay & image of the day button
const apodBtn = (apod) => {
	const loaded = store.get("loaded")
	if(loaded === true) {
		//If apod call returned & overlay is open then display apod content
		const a = Array.from(apod).flat()[1];
		const url = Array.from(a).filter(x => x.includes('hdurl'));
		const media = Array.from(a).filter(x => x.includes('media_type'));
		const info = Array.from(a).filter(x => x.includes('copyright') || x.includes('title'));
		const overlay = store.get("overlay");
			if (overlay == 'open') {
				if (media.flat()[1] == 'image') {
					if (info.length == 1) {
						return `
							<div class="apodOverlay">
							
							<div class="close" onclick="closeApod()">X</div>
							<div class="apodInfo">
							<img class="apodImage" src="${url[0][1]}"/>
							</div>
							
							<div class="apodText">
							${(info[0][0]).toUpperCase()}: ${info[0][1]} 
							</div>
							
							</div>
					`
				} else {
					return `
						<div class="apodOverlay">
						
						<div class="close" onclick="closeApod()">X</div>
						<div class="apodInfo">
						<img class="apodImage" src="${url[0][1]}"/>
						</div>
						
						<div class="apodText">
						${(info[1][0]).toUpperCase()}: ${info[1][1]}
						${(info[0][0]).toUpperCase()}: ${info[0][1]} 
						</div>
						
						</div>
					`
				}
			} else if (media.flat()[1] == 'video') {
				return `
				<div class="apodOverlay">
				
				<div class="close" onclick="closeApod()">X</div>
				<div class="apodInfo">
				
				<iframe class="apodVideo" src="${url[0][1]}" 
				frameborder="0" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen>
				</iframe>
				
				</div>
				
				</div>
			`	
			} else {
				return ` Content is not available. `
			}
	} else {	
		//If overlay is not open then display the image of the day buttons
		return `
			<div style="margin-left: 50px;" class="center">
			<div class="btnStyle" onclick="openApod()">Image of the day</div>
			</div>		
		`
		} 
	} else {
		return ``
	}
}
//Altering store to reflect state of the overlay
const openApod = () => {
	const overlay = "open"
	const chosenRover = ""
	updateStore(store, { overlay, chosenRover })
}
const closeApod = () => {
	const newState = store.set("overlay", "")
	updateStore(store, newState)
}
//Greeting
const Greeting = (name) => {
	const loaded = store.get("loaded");
	if (loaded === true) {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
	} else {
		return ``
	}
}
//Rover buttons
const buttons = (roverName) => {
	const loaded = store.get("loaded")
	if (loaded === true) {
	return `
	<h2>Select a rover</h2>
	<div class="mobileCenter">
	<ul class="listStyle">
		${store
		.get("roverName")
		.map(x => btnPass(x))
		.join(" ")}
	</ul>
	</div>
	${smallLoading()}
	`
	} else {
		return ``
	}
}
const smallLoading = () => {
	const smallLoaded = store.get("smallLoading");
	const launch = store.get("launch");

	if (smallLoaded === true) {
		return `
			<div class="loaderSmall">Loading information... </div>
		`
	} else {
		return ``
	}
}
function btnPass(roverName) {
	const loaded = store.get("loaded")
	if (loaded === true) {
	return `
		<span class="btnStyle" onclick="updateBtn('${String(roverName)}')">
		${roverName}
		</span>
	`
	} else {
		return ``
	}
}
const updateBtn = (roverName) => {
	const newState = store.set("chosenRover", roverName);
	updateStore(store, newState);
	const load = store.set("smallLoading", true);
	updateStore(store, load);
	marsTwo(roverName);
}
//Rover information list
const addTwo = (callback) => {
	return callback(store.get("launch"), store.get("landing"), store.get("status"))
}
//Creating rover information list 
const createFull = (launch, landing, status) => {
	const loaded = store.get("loaded")
	if (loaded === true && store.get("chosenRover") !== '') {
		return `
			<ul class="info">
			<li>Launch Date: ${launch}</li>
			<li>Landing Date: ${landing}</li>
			<li>Status: ${status}</li>
			</ul>
		`
	} else {
		return ``
	}
	
}
//Rover grid - appears on click on rover buttons
//Calling parameters from store
const uiElement = (callback) => {
	return callback(store.get("dataLink"), store.get("camera"), store.get("dataDate"))
}
//Grid components template
const ui = (dataLink, camera, dataDate) => {
	let b = Array.from(dataLink)
	let c = Array.from(dataDate)
	let cameraO = Array.from(camera)
	if (store.get("chosenRover") !== '' && camera.length !== 0 && store.get("overlay") == '') {
	return b.map(function(x, i) { 
		return `	
		<div class="imgGrid">
		<img class="imgStyle" src="${x}"/>
		<div class="color">
		<div class="infoG">
		Date: ${c[i]}<br>
		Camera: ${cameraO[i]}
		</div>
		</div>
		</div>
		`
	})
	} else {
		return `  `
	}
}
//Grid section template
const oneSection = () => {
	if (store.get("chosenRover") !== '') {
		return `
			<section class="one">
				<span class="head">Recent Images</span>
				<section class="imgSection">	
					${uiElement(ui)}
				</section>			
			</section>
		`
	} else {
		return ``
	}
}

// Apod API call
const getImageOfTheDay = (state) => {
    let { apod } = state
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => {
			let loaded = true;
			updateStore(store, { apod, loaded })
		})
		
}
//Rover API call
const marsTwo = (state) => {
	let { roverName } = state
	fetch(`http://localhost:3000/rover/${state}`)
        .then(res => res.json())
        .then(data => {
			let a = data.data.photos
			const newState = store.set("data", a)
			updateStore(store, newState)
			processData()
	})
}

//Processing rover data
const processData = () => {
	const data = store.get("data")
	const dataLinkA = data.filter(function(x, i) {
		if (i < 6) {
			return x
		}
	})
	const dataDate = dataLinkA.map(x => x.earth_date)
	const dataLink = dataLinkA.map(x => x.img_src)
	updateStore(store, { dataDate })
	updateStore(store, { dataLink })
	const roverInfo = dataLinkA
	//Camera data			
	const camera = roverInfo.map(x => x.camera).map(x => x.name)
	//Info specific to rover
	const landing = String(roverInfo.map(x => x.rover.landing_date).filter((item, i) => {
		return roverInfo.map(x => x.rover.landing_date).indexOf(item) === i
	}))
	const status = String(roverInfo.map(x => x.rover.status).filter((item, i) => {
		return roverInfo.map(x => x.rover.status).indexOf(item) === i
	}))
	const launch = String(roverInfo.map(x => x.rover.launch_date).filter((item, i) => {
		return roverInfo.map(x => x.rover.launch_date).indexOf(item) === i
	}))
	const newState = store.set("smallLoading", false)
	updateStore(store, newState)
	updateStore(store, { landing, status, launch, camera })
	
}



