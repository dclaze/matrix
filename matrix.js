var Matrix = (function() {
    function Matrix(params) {
        var matrix = new Array();
        matrix.__proto__ = Matrix.prototype;

        if (typeof(params) !== "undefined" && typeof params.height !== "undefined" && typeof params.width !== "undefined") {
            return matrix.create(params.height, params.width);
        } else {
            return matrix;
        }
    };
    Matrix.prototype = new Array;
    Matrix.prototype.constructor = Matrix;

    Matrix.prototype.create = function(height, width) {
        for (var i = 0; i < height; i++) {
            this[i] = new Array(width);
        }
        return this;
    };
    Matrix.prototype.getWidth = function() {
        return this[0].length;
    };
    Matrix.prototype.getHeight = function() {
        return this.length;
    };
    Matrix.prototype.isSquare = function() {
        return typeof(this[0][0]) !== "undefined" && this.length == this[0].length;
    };
    Matrix.prototype.withData = function() {
        //2D Array Syntax - Row Major
        //[[1,2],[3,4]]
        if (this.length > 0) {
            console.error("Cannot add data to already initialized matrix");
        } else {
            var arr = arguments[0];
            if (arguments.length == 1 && (arr instanceof Array)) {
                for (var i = 0; i < arr.length; i++) {
                    this.push.call(this, arguments[0][i]);
                }
            } else {
                this.push.apply(this, arguments);
            }
        }
        return this;
    };
    Matrix.prototype.withPrefilledValue = function(value) {
        if (typeof value === "undefined") {
            var value = 0;
        }
        var height = this.getHeight(),
            width = this.getWidth();
        for (var h = 0; h < height; h++) {
            for (var w = 0; w < width; w++) {
                this[h][w] = value;
            }
        }

        return this;
    };

    Matrix.prototype.clone = function() {
        var clone = [],
            height = this.getHeight();
        for (var i = 0; i < height; i++)
            clone.push(this[i].slice());

        return clone;
    };

    Matrix.prototype.multiplyByScalar = function(scalar) {
        var height = this.getHeight(),
            width = this.getWidth();

        for (var h = 0; h < height; h++) {
            for (var w = 0; w < width; w++) {
                this[h][w] *= scalar;
            }
        }
        return this;
    };

    Matrix.prototype.multiply = function(matrix) {
        if (!matrix instanceof Matrix)
            return console.error('Argument:', matrix, 'is not of type Matrix!');

        var width = this.getWidth(),
            height = this.getHeight()
            multiplierWidth = matrix.getWidth(),
            multiplierHeight = matrix.getHeight(),
            outputMatrix = new Matrix({
                width: multiplierWidth,
                height: height
            }),
            outputHeight = outputMatrix.getHeight(),
            outputWidth = outputMatrix.getWidth();

        if (width != multiplierHeight)
            return console.error('Argument:', matrix, 'cannot be multiplied by', this, '!');

        for (var i = 0; i < outputHeight; i++) {
            for (var j = 0; j < outputWidth; j++) {
                var value = 0;
                for (var k = 0; k < width; k++)
                    value += this[i][k] * matrix[k][j];
                outputMatrix[i][j] = value;
            }
        }

        return outputMatrix;
    };

    Matrix.prototype.transpose = function() {
        var width = this.getWidth(),
            height = this.getHeight(),
            transposeMatrix = new Matrix({
                width: height,
                height: width
            });

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                transposeMatrix[j][i] = this[i][j];
            }
        }

        return transposeMatrix;
    };

    Matrix.prototype.minor = function(h, w) {
        var height = this.getHeight(),
            width = this.getWidth(),
            newMatrix = new Matrix({
                width: width - 1,
                height: height - 1
            });

        if (w < 0 || w > width-1 || h < 0 || h > height-1)
            return console.error("Argument: " + w + "," + h + " Index out of bounds");

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                if (i != h && j != w) {
                    var row = i < h ? i : i - 1,
                        column = j < w ? j : j - 1;
                    newMatrix[row][column] = this[i][j];
                }
            }
        }

        return newMatrix;
    };

    Matrix.prototype.determinant = function() {
        var getDeterminant = function(matrix) {
            var width = matrix.getWidth();

            if (!matrix.isSquare())
                return console.error("Argument: " + matrix + " is not square.");

            if (width == 1)
                return matrix[0][0];
            else {
                if (width == 2)
                    return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1];
                else {
                    var determinant = 0;
                    for (var w = 0; w < width; w++) {
                        var minor = matrix.minor(0, w);
                        determinant += Math.pow(-1, w) * matrix[0][w] * getDeterminant(minor);
                    }
                    return determinant;
                }
            }
        };
        return getDeterminant(this);
    };

    Matrix.prototype.print = function() {
        var height = this.getHeight(),
            width = this.getWidth();

        for (var i = 0; i < height; i++) {
            console.log(this[i]);
        }

        return this;
    };

    Matrix.prototype.getDimensions = function() {
        //Multi-dimensional matricies are accessed in row major order eg. matrix[z][y][x]
        var dimensions = [];
        var dimension = this;

        while (typeof(dimension[0]) != 'undefined') {
            dimensions.push(dimension.length);
            dimension = dimension[0];
        }

        return dimensions;
    };

    //TODO jsPerf against forEach vs for loop
    Matrix.prototype.iterate = function(transformFn) {
        if (typeof(transformFn) !== "function")
            throw "Argument:" + transformFn + " not a function. ";

        var matrix = this;
        matrix.forEach(function(row, widthIdx, matrix) {
            row.forEach(function(value, heightIdx, row) {
                var widthIdx = this.indexOf(row),
                    matrix = this;
                transformFn(value, widthIdx, heightIdx, matrix);
            }.bind(matrix));
        });

        return this;
    };

    Matrix.prototype.numberOfDimensions = function() {
        var dimensionCount = 0;
        var dimension = this;
        while (typeof(dimension[0]) != 'undefined') {
            dimensionCount++;
            dimension = dimension[0];
        }
        return dimensionCount;
    };

    return Matrix;
})();
