define('app/map', [], function() {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY: 3,
    
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
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [ , ,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            
        ]
        
        return maps;
    }
  }
})