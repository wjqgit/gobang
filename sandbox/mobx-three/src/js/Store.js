import { computed, observable } from 'mobx'

class Position {
  @observable x
  @observable y
  @observable z

  constructor(vector) {
    this.x = vector.x
    this.y = vector.y
    this.z = vector.z
  }


}

class Store {
  @observable position = {
    x: 0,
    y: 0,
    z: 0,
  }

  updatePosition = (vector) => {
    this.position = new Position(vector)
  }

}


const store = window.store = new Store


export default store;
