define('app/map', [], function() {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY: 3,
    TILE2: 4,
    TILE3: 5,
    CLOUD: 6, //with 5

  */
  return {
    getMap: function() {

        var maps = [];

        maps[0] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,4, ,4,2,2,2,4, ,4,2,5,2,2,5,2,4, ,4,4,2,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , ,6,6,6,6, , , , , , , , , , , , , ,6,6,6,6, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ ,6,6,6,6,6, , , , , ,6,6,6,6,6, , , , , , , ,6,6,6,6,6, , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , ,1, , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],

        ]

        return maps;
    }
  }
})