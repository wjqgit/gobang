// CURVE
export var LineCurvePathMap = {};
export var EllipseCurvePathMap = {};

export function GetLineCurvePath(vector) {
    var key = vector.x + ';' + vector.y;

    var lineCurvePath = KOVAN.LineCurvePathMap[key];

    if (!lineCurvePath) {
        lineCurvePath = new THREE.CurvePath();

        lineCurvePath.add(new THREE.LineCurve(
            new THREE.Vector2(0, 0),
            new THREE.Vector2(vector.x, vector.y)
        ));

        KOVAN.LineCurvePathMap[key] = lineCurvePath;
    }

    return lineCurvePath;
}

export function GetEllipseCurvePath(xRadius, yRadius, aStartAngle, aEndAngle, aClockwise) {
    var key = xRadius + ';' + yRadius + ';' + aStartAngle + ';' + aEndAngle + ';' + aClockwise;

    var ellipseCurvePath = KOVAN.EllipseCurvePathMap[key];

    if (!ellipseCurvePath) {
        ellipseCurvePath = new THREE.CurvePath();

        ellipseCurvePath.add(new THREE.EllipseCurve(
            0, 0,
            xRadius, yRadius,
            aStartAngle, aEndAngle,
            aClockwise, 0
        ));

        KOVAN.EllipseCurvePathMap[key] = ellipseCurvePath;
    }

    return ellipseCurvePath;
}

// GEOMETRY
export var LineCurveGeometryMap = {};
export var EllipseCurveGeometryMap = {};

export function GetLineCurveGeometry(vector, resolution) {
    var key = vector.x + ';' + vector.y + ';' + resolution;

    var lineCurveGeometry = KOVAN.LineCurveGeometryMap[key];

    if (!lineCurveGeometry) {
        var lineCurvePath = LineCurvePathMap[vector.x + ';' + vector.y];

        lineCurveGeometry = lineCurvePath.createPointsGeometry(resolution);

        KOVAN.LineCurveGeometryMap[key] = lineCurveGeometry;
    }

    return lineCurveGeometry;
}

export function GetEllipseCurveGeometry(xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, resolution) {
    var key = xRadius + ';' + yRadius + ';' + aStartAngle + ';' + aEndAngle + ';' + aClockwise + ';' + resolution;

    var ellipseCurveGeometry = KOVAN.EllipseCurveGeometryMap[key];

    if (!ellipseCurveGeometry) {
        var ellipseCurvePath = EllipseCurvePathMap[xRadius + ';' + yRadius + ';' + aStartAngle + ';' + aEndAngle + ';' + aClockwise];

        ellipseCurveGeometry = ellipseCurvePath.createPointsGeometry(resolution);

        KOVAN.EllipseCurveGeometryMap[key] = ellipseCurveGeometry;
    }

    return ellipseCurveGeometry;
}

export function FillVertices(geometry) {
    let numOfVertices = geometry.vertices.length;

    if (numOfVertices > 2 * KOVAN.CurveGeometryResolution + 1) return geometry;

    for (let i = 0; i < numOfVertices; i++) {
        let currentIndex = 2 * i;
        geometry.vertices.splice(currentIndex, 0, geometry.vertices[currentIndex]);
    }

    geometry.vertices.splice(geometry.vertices.length - 1, 1);
    geometry.vertices.splice(0, 1);

    return geometry;
}

// UTIL
export function RoundTo(x, d) {
    return +(Math.round(x + "e+" + d) + "e-" + d); // append "e+3" equals to multiply the number by 1000, and +() convert a string back to number.
}

export function ParseNumber(s) {
    return parseInt(s.match(/\d+/g));
}

export function Pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function TestNumberSimilarity(a, b, tolerance) {
    var tolerance = tolerance || 0;
    if ((a <= (b + tolerance)) && (a >= (b - tolerance))) {
        return true;
    }
    return false;
}


export function TestPointSimilarity(pointObj, x, y, z, tolerance) {
    if (TestNumberSimilarity(x, pointObj.x, tolerance) && TestNumberSimilarity(y, pointObj.y, tolerance) && TestNumberSimilarity(z, pointObj.z, tolerance)) {
        return true;
    }
}

export function RectifyAngle(angle) {
    angle = angle >= 2 * Math.PI ? angle - 2 * Math.PI : angle;
    angle = angle < 0 ? angle + 2 * Math.PI : angle;

    return angle;
}
