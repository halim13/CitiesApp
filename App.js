import React, {Component} from 'react'
import {
	Platform,
	StyleSheet,
	Text,
	View,
	AsyncStorage,
} from 'react-native'

const key = 'state'

import Tabs from './src'

export default class App extends Component {
	state = {
		cities: [],
	}

	async componentDidMount(){
		try {
			let cities = await AsyncStorage.getItem(key)
			if(cities) {
				cities = JSON.parse(cities)
				this.setState({cities})
			}
		} catch (e) {
			console.log('error from AsyncStorage: ', e)
		}
	}

	addCity = city => {
		const cities = this.state.cities
		cities.push(city)
		this.setState({cities}, () => {
			AsyncStorage.setItem(key, JSON.stringify(cities))
				.then(() => console.log('storage updated!'))
				.catch(e => console.log('error add city: ', e))
		})
	}

	addLocation = (location, city) => {
		const index = this.state.cities.findIndex(item => {
			return item.id === city.id
		})
		const chosenCity = this.state.cities[index]
		chosenCity.locations.push(location)
		const cities = [
			...this.state.cities.slice(0, index),
			chosenCity,
			...this.state.cities.slice(index + 1)
		]
		this.setState({cities}, () => {
			AsyncStorage.setItem(key, JSON.stringify(cities))
				.then(() => console.log('storage updated!'))
				.catch(e => console.log('error add location: ', e))
		})
	}

	render(){
		return (
			<Tabs
				screenProps={{
					cities: this.state.cities,
					addCity: this.addCity,
					addLocation: this.addLocation
				}}
			/>
		)
	}
}
