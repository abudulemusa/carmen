var proximity = require('../lib/util/proximity');
var test = require('tape');

test('proximity#toCenter', function(t) {
    t.deepEquals(proximity.toCenter([ -180, 0, 0, 85 ]), [ -10018754.171394622, 5236173.783920941 ]);
    t.deepEquals(proximity.toCenter([ -180, -85, 0, 0 ]), [ -10018754.171394622, -5236173.783920941 ]);
    t.deepEquals(proximity.toCenter([ 0, 0, 180, 85 ]), [ 10018754.171394622, 5236173.783920941 ]);
    t.deepEquals(proximity.toCenter([ -84, 40, -80, 40 ]), [ -9128198.245048434, 4865942.279503176 ]);
    t.end();
});

test('proximity#coarse', function(t) {
    t.deepEquals(
        proximity.coarse(
            [ 8760917240053761, 8760917240053762 ],
            [ [ 1, 33554434 ], [] ],
            [ 1, 6 ],
            { proximity: [ -60, -20 ] }
        ),
        [ 8760917240053762, 8760917240053761 ],
        'proximity - one layer'
    );

    t.deepEquals(
        proximity.coarse(
            [ 8760917240053763, 8760917273608193 ],
            [ [ 549755813891 ], [ 9346654142465 ] ],
            [ 1, 6 ],
            { proximity: [ -80, 40 ] }
        ),
        [ 8760917273608193, 8760917240053763 ],
        'proximity - accross layers'
    );
    t.end();
});

test('proximity#fine', function(t) {
    t.deepEquals(
        proximity.fine(
            { type: 'FeatureCollection',
              features: [
                {
                    id: 'layer.1',
                    relevance: 1,
                    center: [0,0]
                },{
                    id: 'layer.2',
                    relevance: 0,
                    center: [0,0]
                }] },
            { proximity: [1,1] }
        ),
        { features: [ { center: [ 0, 0 ], id: 'layer.1', relevance: 1 }, { center: [ 0, 0 ], id: 'layer.2', relevance: 0 } ], type: 'FeatureCollection' },
        'short circuit different relev'
    );

    t.deepEquals(
        proximity.fine(
            { type: 'FeatureCollection',
              features: [
                {
                    id: 'layer.1',
                    relevance: 1,
                    center: [0,0]
                },{
                    id: 'test.1',
                    relevance: 1,
                    center: [0,0]
                }]},
            { proximity: [1,1] }
        ),
        { features: [ { center: [ 0, 0 ], id: 'layer.1', relevance: 1 }, { center: [ 0, 0 ], id: 'test.1', relevance: 1 } ], type: 'FeatureCollection' },
        'short circuit different layers'
    );

    t.deepEquals(
        proximity.fine(
            { type: 'FeatureCollection',
              features: [
                {
                    id: 'layer.1',
                    relevance: 1,
                    center: [0,0]
                },{
                    id: 'layer.2',
                    relevance: 1,
                    center: [1,1]
                }] },
                { proximity: [0,0]}
        ),
        { features: [ { center: [ 0, 0 ], id: 'layer.1', relevance: 1 }, { center: [ 1, 1 ], id: 'layer.2', relevance: 1 } ], type: 'FeatureCollection' },        'sort on proximity'
    );

    t.deepEquals(
        proximity.fine(
            { type: 'FeatureCollection',
              features: [
                {
                    id: 'layer.1',
                    relevance: 1,
                    center: [0,0]
                },{
                    id: 'layer.2',
                    relevance: 1,
                    center: [1,1]
                }] },
                { proximity: [1,1]}
        ),
        { features: [ { center: [ 1, 1 ], id: 'layer.2', relevance: 1 }, { center: [ 0, 0 ], id: 'layer.1', relevance: 1 } ], type: 'FeatureCollection' },
        'sort on proximity'
    );

    t.end();
});
