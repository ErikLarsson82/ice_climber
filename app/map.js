define('app/map', [], function() {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY1: 3,
    ENEMY2: 4,
    VICTORY: 5
    TILE3: 6
    GRANPA: 7
    CLOUD1: 8
    CLOUD2: 9
    BUSH1: 'A'
    BUSH1: 'B'
    DEATH: 'C'
    SPIKE: 'D' //Walk two tiles
    SPIKE: 'E' //Walk four tiles
    SPIKE: 'F' //Walk eight tiles
  */
  const A = 'A'
  const B = 'B'
  const C = 'C'
  const D = 'D'
  const E = 'E'
  const F = 'F'
  const G = 'G'x
  return {
    getMap: function() {

        var maps = [];

        maps[0] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            
        ]
        
        return maps;
    }
  }
})