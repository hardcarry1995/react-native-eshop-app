class setGet {
  static isHomeLoaded = false;

  static set() {
    this.isHomeLoaded = true;
  }

  static get() {
    return this.isHomeLoaded;
  }
}

export default setGet;