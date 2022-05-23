
const ToCanvas = (opts, canvas) => {
    // _Render(bwipp_lookup(opts.bcid), opts, DrawingCanvas(opts, canvas));
    _Render(bwipp_lookup(opts.bcid), opts, DrawingCanvas(opts, canvas));
    return canvas;
}

var $$ = null;
var $j = 0; // stack pointer
var $k = []; // operand stack

var $0 = {
    $error: new Map,
};

function $forall(o, cb) {
  if (o instanceof Uint8Array) {
      for (var i = 0, l = o.length; i < l; i++) {
          $k[$j++] = o[i];
          if (cb && cb()) break;
      }
  } else if (o instanceof Array) {
      // The array may be a view.
      for (var a = o.b, i = o.o, l = o.o + o.length; i < l; i++) {
          $k[$j++] = a[i];
          if (cb && cb()) break;
      }
  } else if (typeof o === 'string') {
      for (var i = 0, l = o.length; i < l; i++) {
          $k[$j++] = o.charCodeAt(i);
          if (cb && cb()) break;
      }
  } else if (o instanceof Map) {
      for (var keys = o.keys(), i = 0, l = o.size; i < l; i++) {
          var id = keys.next().value;
          $k[$j++] = id;
          $k[$j++] = o.get(id);
          if (cb && cb()) break;
      }
  } else {
      for (var id in o) {
          $k[$j++] = id;
          $k[$j++] = o[id];
          if (cb && cb()) break;
      }
  }
}

function $eq(a, b) {
  if (typeof a === 'string' && typeof b === 'string') {
      return a == b;
  }
  if (a instanceof Uint8Array && b instanceof Uint8Array) {
      if (a.length != b.length) {
          return false;
      }
      for (var i = 0, l = a.length; i < l; i++) {
          if (a[i] != b[i]) {
              return false;
          }
      }
      return true;
  }
  if (a instanceof Uint8Array && typeof b === 'string' ||
      b instanceof Uint8Array && typeof a === 'string') {
      if (a instanceof Uint8Array) {
          a = $z(a);
      } else {
          b = $z(b);
      }
      return a == b;
  }
  return a == b;
}

function $ne(a, b) {
  return !$eq(a, b);
}

function $z(s) {
  if (s instanceof Uint8Array) {
      // Postscript treats nul-char as end of string, even if string is
      // longer.
      for (var i = 0, l = s.length; i < l && s[i]; i++);
      if (i < l) {
          return String.fromCharCode.apply(null, s.subarray(0, i));
      }
      return String.fromCharCode.apply(null, s)
  }
  return '' + s;
}

function $a(a) {
  if (!arguments.length) {
      for (var i = $j - 1; i >= 0 && $k[i] !== Infinity; i--);
      if (i < 0) {
          throw new Error('array-marker-not-found');
      }
      a = $k.splice(i + 1, $j - 1 - i);
      $j = i;
  } else if (!(a instanceof Array)) {
      a = new Array(+arguments[0]);
      for (var i = 0, l = a.length; i < l; i++) {
          a[i] = null;
      }
  }
  a.b = a; // base array
  a.o = 0; // offset into base
  return a;
}

function $get(s, k) {
  if (s instanceof Uint8Array) {
      return s[k];
  }
  if (typeof s === 'string') {
      return s.charCodeAt(k);
  }
  if (s instanceof Array) {
      return s.b[s.o + k];
  }
  if (k instanceof Uint8Array) {
      return s.get($z(k));
  }
  return s.get(k);
}

function _Render(encoder, params, drawing) {
	var text = params.text;
	if (!text) {
		throw new ReferenceError('bwip-js: bar code text not specified.');
	}

	// Set the bwip-js defaults
    FixupOptions(params);
	var scale	= params.scale || 2;
	var scaleX	= +params.scaleX || scale;
	var scaleY	= +params.scaleY || scaleX;
	var rotate	= params.rotate || 'N';

	// Create a barcode writer object.  This is the interface between
	// the low-level BWIPP code, the bwip-js graphics context, and the
	// drawing interface.
	var bw = new BWIPJS(drawing);

	// Set the BWIPP options
	var opts = {};
	for (var id in params) {
		if (!BWIPJS_OPTIONS[id]) {
			opts[id] = params[id];
		}
	}

	// Fix a disconnect in the BWIPP rendering logic
	if (opts.alttext) {
		opts.includetext = true;
	}
	// We use mm rather than inches for height - except pharmacode2 height
	// which is already in mm.
	if (+opts.height && encoder != bwipp_pharmacode2) {
		opts.height = opts.height / 25.4 || 0.5;
	}
	// Likewise, width
	if (+opts.width) {
		opts.width = opts.width / 25.4 || 0;
	}

	// Scale the image
	bw.scale(scaleX, scaleY);

	// Call into the BWIPP cross-compiled code and render the image.
    bwipp_encode(bw, encoder, text, opts);
	return bw.render();		// Return whatever drawing.end() returns
}

function bwipp_lookup(symbol) {
  if (!symbol) {
      throw new Error("bwipp.undefinedEncoder: bcid is not defined");
  }
  switch (symbol.replace(/-/g, "_")) {
      case "datamatrix":
          return bwipp_datamatrix;
  }
  throw new Error("bwipp.unknownEncoder: unknown encoder name: " + symbol);
}


function bwipp_datamatrix() {
  var $1 = {}; //#17090
  $1.options = $k[--$j]; //#17092
  $1.barcode = $k[--$j]; //#17093
  $1.dontdraw = false; //#17095
  $1.columns = 0; //#17096
  $1.rows = 0; //#17097
  $1.format = "square"; //#17098
  $1.version = "unset"; //#17099
  $1.parse = false; //#17100
  $1.parsefnc = false; //#17101
  $1.encoding = "auto"; //#17102
  $1.mailmark = false; //#17103
  $1.raw = false; //#17104
  $1.dmre = false; //#17105
  $1.dindmre = false; //#17106
  $1.isodmre = false; //#17107
  $forall($1.options, function() { //#17118
      var _3 = $k[--$j]; //#17118
      $1[$k[--$j]] = _3; //#17118
  }); //#17118
  if ($ne($1.version, "unset")) { //#17124
      $search($1.version, "x"); //#17121
      $j--; //#17122
      $1.rows = $k[--$j]; //#17122
      $j--; //#17123
      $1.columns = $k[--$j]; //#17123
  } //#17123
  $1.columns = ~~$z($1.columns); //#17126
  $1.rows = ~~$z($1.rows); //#17127
  $1.isodmre = $1.dmre; //#17129
  $k[$j++] = Infinity; //#17186
  $k[$j++] = $a([10, 10, 1, 1, 5, 1]); //#17162
  $k[$j++] = $a([12, 12, 1, 1, 7, 1]); //#17162
  $k[$j++] = $a([14, 14, 1, 1, 10, 1]); //#17162
  $k[$j++] = $a([16, 16, 1, 1, 12, 1]); //#17162
  $k[$j++] = $a([18, 18, 1, 1, 14, 1]); //#17162
  $k[$j++] = $a([20, 20, 1, 1, 18, 1]); //#17162
  $k[$j++] = $a([22, 22, 1, 1, 20, 1]); //#17162
  $k[$j++] = $a([24, 24, 1, 1, 24, 1]); //#17162
  $k[$j++] = $a([26, 26, 1, 1, 28, 1]); //#17162
  $k[$j++] = $a([32, 32, 2, 2, 36, 1]); //#17162
  $k[$j++] = $a([36, 36, 2, 2, 42, 1]); //#17162
  $k[$j++] = $a([40, 40, 2, 2, 48, 1]); //#17162
  $k[$j++] = $a([44, 44, 2, 2, 56, 1]); //#17162
  $k[$j++] = $a([48, 48, 2, 2, 68, 1]); //#17162
  $k[$j++] = $a([52, 52, 2, 2, 84, 2]); //#17162
  $k[$j++] = $a([64, 64, 4, 4, 112, 2]); //#17162
  $k[$j++] = $a([72, 72, 4, 4, 144, 4]); //#17162
  $k[$j++] = $a([80, 80, 4, 4, 192, 4]); //#17162
  $k[$j++] = $a([88, 88, 4, 4, 224, 4]); //#17162
  $k[$j++] = $a([96, 96, 4, 4, 272, 4]); //#17162
  $k[$j++] = $a([104, 104, 4, 4, 336, 6]); //#17162
  $k[$j++] = $a([120, 120, 6, 6, 408, 6]); //#17162
  $k[$j++] = $a([132, 132, 6, 6, 496, 8]); //#17162
  $k[$j++] = $a([144, 144, 6, 6, 620, 10]); //#17162
  $k[$j++] = $a([8, 18, 1, 1, 7, 1]); //#17162
  $k[$j++] = $a([8, 32, 1, 2, 11, 1]); //#17162
  if ($1.dindmre || $1.isodmre) { //#17162
      $k[$j++] = $a([8, 48, 1, 2, 15, 1]); //#17162
  } //#17162
  if ($1.dindmre || $1.isodmre) { //#17163
      $k[$j++] = $a([8, 64, 1, 4, 18, 1]); //#17163
  } //#17163
  if ($1.isodmre) { //#17164
      $k[$j++] = $a([8, 80, 1, 4, 22, 1]); //#17164
  } //#17164
  if ($1.isodmre) { //#17165
      $k[$j++] = $a([8, 96, 1, 4, 28, 1]); //#17165
  } //#17165
  if ($1.isodmre) { //#17166
      $k[$j++] = $a([8, 120, 1, 6, 32, 1]); //#17166
  } //#17166
  if ($1.isodmre) { //#17167
      $k[$j++] = $a([8, 144, 1, 6, 36, 1]); //#17167
  } //#17167
  $k[$j++] = $a([12, 26, 1, 1, 14, 1]); //#17170
  $k[$j++] = $a([12, 36, 1, 2, 18, 1]); //#17170
  if ($1.dindmre || $1.isodmre) { //#17170
      $k[$j++] = $a([12, 64, 1, 4, 27, 1]); //#17170
  } //#17170
  if ($1.isodmre) { //#17171
      $k[$j++] = $a([12, 88, 1, 4, 36, 1]); //#17171
  } //#17171
  $k[$j++] = $a([16, 36, 1, 2, 24, 1]); //#17174
  $k[$j++] = $a([16, 48, 1, 2, 28, 1]); //#17174
  if ($1.dindmre || $1.isodmre) { //#17174
      $k[$j++] = $a([16, 64, 1, 4, 36, 1]); //#17174
  } //#17174
  if ($1.isodmre) { //#17175
      $k[$j++] = $a([20, 36, 1, 2, 28, 1]); //#17175
  } //#17175
  if ($1.isodmre) { //#17176
      $k[$j++] = $a([20, 44, 1, 2, 34, 1]); //#17176
  } //#17176
  if ($1.isodmre) { //#17177
      $k[$j++] = $a([20, 64, 1, 4, 42, 1]); //#17177
  } //#17177
  if ($1.isodmre) { //#17178
      $k[$j++] = $a([22, 48, 1, 2, 38, 1]); //#17178
  } //#17178
  if ($1.dindmre) { //#17179
      $k[$j++] = $a([24, 32, 1, 2, 28, 1]); //#17179
  } //#17179
  if ($1.dindmre) { //#17180
      $k[$j++] = $a([24, 36, 1, 2, 33, 1]); //#17180
  } //#17180
  if ($1.dindmre || $1.isodmre) { //#17181
      $k[$j++] = $a([24, 48, 1, 2, 41, 1]); //#17181
  } //#17181
  if ($1.dindmre || $1.isodmre) { //#17182
      $k[$j++] = $a([24, 64, 1, 4, 46, 1]); //#17182
  } //#17182
  if ($1.dindmre) { //#17183
      $k[$j++] = $a([26, 32, 1, 2, 32, 1]); //#17183
  } //#17183
  if ($1.dindmre || $1.isodmre) { //#17184
      $k[$j++] = $a([26, 40, 1, 2, 38, 1]); //#17184
  } //#17184
  if ($1.dindmre || $1.isodmre) { //#17185
      $k[$j++] = $a([26, 48, 1, 2, 42, 1]); //#17185
  } //#17185
  if ($1.dindmre || $1.isodmre) { //#17186
      $k[$j++] = $a([26, 64, 1, 4, 50, 1]); //#17186
  } //#17186
  $1.metrics = $a(); //#17186
  $1.urows = $1.rows; //#17190
  $1.ucols = $1.columns; //#17191
  $1.fullcws = $a([]); //#17192
  var _1Z = $1.metrics; //#17193
  for (var _1a = 0, _1b = _1Z.length; _1a < _1b; _1a++) { //#17210
      $1.m = $get(_1Z, _1a); //#17194
      $1.rows = $get($1.m, 0); //#17195
      $1.cols = $get($1.m, 1); //#17196
      $1.regh = $get($1.m, 2); //#17197
      $1.regv = $get($1.m, 3); //#17198
      $1.rscw = $get($1.m, 4); //#17199
      $1.rsbl = $get($1.m, 5); //#17200
      $1.mrows = $f($1.rows - (2 * $1.regh)); //#17201
      $1.mcols = $f($1.cols - (2 * $1.regv)); //#17202
      $1.ncws = $f((~~(($1.mrows * $1.mcols) / 8)) - $1.rscw); //#17203
      $1.okay = true; //#17204
      if (($1.urows != 0) && ($1.urows != $1.rows)) { //#17205
          $1.okay = false; //#17205
      } //#17205
      if (($1.ucols != 0) && ($1.ucols != $1.cols)) { //#17206
          $1.okay = false; //#17206
      } //#17206
      if ($eq($1.format, "square") && $ne($1.rows, $1.cols)) { //#17207
          $1.okay = false; //#17207
      } //#17207
      if ($eq($1.format, "rectangle") && $eq($1.rows, $1.cols)) { //#17208
          $1.okay = false; //#17208
      } //#17208
      if ($1.okay) { //#17209
          $k[$j++] = Infinity; //#17209
          $aload($1.fullcws); //#17209
          $k[$j++] = $1.ncws; //#17209
          $1.fullcws = $a(); //#17209
      } //#17209
  } //#17209
  $k[$j++] = Infinity; //#17211
  for (var _2C = 0, _2D = 1558; _2C < _2D; _2C++) { //#17211
      $k[$j++] = 10000; //#17211
  } //#17211
  $1.numremcws = $a(); //#17211
  var _2F = $1.fullcws; //#17212
  for (var _2G = 0, _2H = _2F.length; _2G < _2H; _2G++) { //#17212
      $put($1.numremcws, $f($get(_2F, _2G) - 1), 1); //#17212
  } //#17212
  for (var _2K = 1556; _2K >= 0; _2K -= 1) { //#17218
      $1.i = _2K; //#17214
      if ($get($1.numremcws, $1.i) != 1) { //#17217
          $put($1.numremcws, $1.i, $f($get($1.numremcws, $1.i + 1) + 1)); //#17216
      } //#17216
  } //#17216
  if ($1.raw) { //#17220
      $1.encoding = "raw"; //#17220
  } //#17220
  if ($eq($1.encoding, "raw")) { //#17233
      $1.cws = $a($1.barcode.length); //#17223
      $1.i = 0; //#17224
      $1.j = 0; //#17224
      for (;;) { //#17231
          if ($1.i == $1.barcode.length) { //#17226
              break; //#17226
          } //#17226
          $1.cw = ~~$z($geti($1.barcode, $1.i + 1, 3)); //#17227
          $put($1.cws, $1.j, $1.cw); //#17228
          $1.i = $1.i + 4; //#17229
          $1.j = $1.j + 1; //#17230
      } //#17230
      $1.cws = $geti($1.cws, 0, $1.j); //#17232
  } //#17232
  if ($eq($1.encoding, "auto")) { //#17733
      $1.fnc1 = -1; //#17238
      $1.prog = -2; //#17238
      $1.m05 = -3; //#17238
      $1.m06 = -4; //#17238
      $1.lC = -5; //#17239
      $1.lB = -6; //#17239
      $1.lX = -7; //#17239
      $1.lT = -8; //#17239
      $1.lE = -9; //#17239
      $1.unl = -10; //#17239
      $1.sapp = -11; //#17240
      $1.usft = -12; //#17240
      $1.sft1 = -13; //#17240
      $1.sft2 = -14; //#17240
      $1.sft3 = -15; //#17240
      $1.eci = -16; //#17240
      $1.pad = -17; //#17240
      $1.unlcw = 254; //#17241
      var _2p = new Map([
          ["parse", $1.parse],
          ["parsefnc", $1.parsefnc],
          ["eci", true],
          ["FNC1", $1.fnc1],
          ["PROG", $1.prog]
      ]); //#17249
      $1.fncvals = _2p; //#17252
      $k[$j++] = 'msg'; //#17253
      $k[$j++] = $1.barcode; //#17253
      $k[$j++] = $1.fncvals; //#17253
      bwipp_parseinput(); //#17253
      var _2s = $k[--$j]; //#17253
      $1[$k[--$j]] = _2s; //#17253
      $1.msglen = $1.msg.length; //#17254
      if ($1.msglen >= 9) { //#17271
          $aload($geti($1.msg, 0, 7)); //#17258
          var _2y = $k[--$j]; //#17259
          var _2z = $k[--$j]; //#17259
          $k[$j++] = _2y == 29; //#17259
          $k[$j++] = _2z; //#17259
          $j--; //#17259
          var _30 = $k[--$j]; //#17259
          var _31 = $k[--$j]; //#17259
          var _32 = $k[--$j]; //#17259
          var _33 = $k[--$j]; //#17260
          var _34 = $k[--$j]; //#17260
          var _35 = $k[--$j]; //#17260
          if (((((_30 && (_31 == 48)) && (_32 == 30)) && (_33 == 62)) && (_34 == 41)) && (_35 == 91)) { //#17270
              $aload($geti($1.msg, $1.msglen - 2, 2)); //#17261
              var _39 = $k[--$j]; //#17262
              var _3A = $k[--$j]; //#17262
              if ((_39 == 4) && (_3A == 30)) { //#17269
                  if ($get($1.msg, 5) == 53) { //#17265
                      $k[$j++] = Infinity; //#17264
                      $k[$j++] = $1.m05; //#17264
                      $aload($geti($1.msg, 7, $1.msg.length - 9)); //#17264
                      $1.msg = $a(); //#17264
                  } //#17264
                  if ($get($1.msg, 5) == 54) { //#17268
                      $k[$j++] = Infinity; //#17267
                      $k[$j++] = $1.m06; //#17267
                      $aload($geti($1.msg, 7, $1.msg.length - 9)); //#17267
                      $1.msg = $a(); //#17267
                  } //#17267
              } //#17267
          } //#17267
      } //#17267
      $1.msglen = $1.msg.length; //#17272
      $k[$j++] = Infinity; //#17281
      for (var _3Q = 0; _3Q <= 128; _3Q += 1) { //#17275
          $k[$j++] = _3Q; //#17275
          $k[$j++] = _3Q + 1; //#17275
      } //#17275
      $k[$j++] = $1.pad; //#17280
      $k[$j++] = 129; //#17280
      for (var _3S = 0; _3S <= 99; _3S += 1) { //#17280
          var _3U = $cvrs($s(2), _3S, 10); //#17278
          var _3W = $strcpy($s(2), "00"); //#17278
          $puti(_3W, 2 - _3U.length, _3U); //#17278
          $k[$j++] = _3W; //#17279
          $k[$j++] = _3S + 130; //#17279
      } //#17279
      var _3j = $a([$1.lC, $1.lB, $1.fnc1, $1.sapp, $1.prog, $1.usft, $1.m05, $1.m06, $1.lX, $1.lT, $1.lE, $1.eci]); //#17281
      $k[$j++] = 229; //#17281
      for (var _3k = 0, _3l = _3j.length; _3k < _3l; _3k++) { //#17281
          var _3o = $f($k[--$j] + 1); //#17281
          $k[$j++] = $get(_3j, _3k); //#17281
          $k[$j++] = _3o; //#17281
          $k[$j++] = _3o; //#17281
      } //#17281
      $j--; //#17281
      $1.Avals = $d(); //#17282
      $k[$j++] = Infinity; //#17284
      var _3q = $1.Avals; //#17284
      for (var _3v = _3q.size, _3u = _3q.keys(), _3t = 0; _3t < _3v; _3t++) { //#17284
          var _3r = _3u.next().value; //#17284
          $k[$j++] = _3r; //#17284
          $k[$j++] = _3q.get(_3r); //#17284
          $k[$j++] = Infinity; //#17284
          var _3w = $k[--$j]; //#17284
          var _3x = $k[--$j]; //#17284
          $k[$j++] = _3w; //#17284
          $k[$j++] = _3x; //#17284
          var _3y = $a(); //#17284
          $k[$j++] = _3y; //#17284
      } //#17284
      $1.Avals = $d(); //#17285
      $k[$j++] = Infinity; //#17293
      $k[$j++] = $1.sft1; //#17292
      $k[$j++] = 0; //#17292
      $k[$j++] = $1.sft2; //#17292
      $k[$j++] = 1; //#17292
      $k[$j++] = $1.sft3; //#17292
      $k[$j++] = 2; //#17292
      $k[$j++] = 32; //#17292
      $k[$j++] = 3; //#17292
      for (var _43 = 48; _43 <= 57; _43 += 1) { //#17292
          $k[$j++] = _43; //#17292
          $k[$j++] = _43 - 44; //#17292
      } //#17292
      for (var _44 = 65; _44 <= 90; _44 += 1) { //#17293
          $k[$j++] = _44; //#17293
          $k[$j++] = _44 - 51; //#17293
      } //#17293
      $1.CNvals = $d(); //#17294
      $k[$j++] = Infinity; //#17295
      for (var _46 = 0; _46 <= 31; _46 += 1) { //#17295
          $k[$j++] = _46; //#17295
          $k[$j++] = _46; //#17295
      } //#17295
      $1.C1vals = $d(); //#17295
      $k[$j++] = Infinity; //#17301
      for (var _48 = 33; _48 <= 47; _48 += 1) { //#17297
          $k[$j++] = _48; //#17297
          $k[$j++] = _48 - 33; //#17297
      } //#17297
      for (var _49 = 58; _49 <= 64; _49 += 1) { //#17298
          $k[$j++] = _49; //#17298
          $k[$j++] = _49 - 43; //#17298
      } //#17298
      for (var _4A = 91; _4A <= 95; _4A += 1) { //#17299
          $k[$j++] = _4A; //#17299
          $k[$j++] = _4A - 69; //#17299
      } //#17299
      $k[$j++] = $1.fnc1; //#17301
      $k[$j++] = 27; //#17301
      $k[$j++] = $1.usft; //#17301
      $k[$j++] = 30; //#17301
      $1.C2vals = $d(); //#17302
      $k[$j++] = Infinity; //#17303
      for (var _4E = 96; _4E <= 127; _4E += 1) { //#17303
          $k[$j++] = _4E; //#17303
          $k[$j++] = _4E - 96; //#17303
      } //#17303
      $1.C3vals = $d(); //#17303
      $k[$j++] = Infinity; //#17308
      var _4G = $1.CNvals; //#17305
      for (var _4L = _4G.size, _4K = _4G.keys(), _4J = 0; _4J < _4L; _4J++) { //#17305
          var _4H = _4K.next().value; //#17305
          $k[$j++] = _4H; //#17305
          $k[$j++] = _4G.get(_4H); //#17305
          $k[$j++] = Infinity; //#17305
          var _4M = $k[--$j]; //#17305
          var _4N = $k[--$j]; //#17305
          $k[$j++] = _4M; //#17305
          $k[$j++] = _4N; //#17305
          var _4O = $a(); //#17305
          $k[$j++] = _4O; //#17305
      } //#17305
      var _4P = $1.C1vals; //#17306
      for (var _4U = _4P.size, _4T = _4P.keys(), _4S = 0; _4S < _4U; _4S++) { //#17306
          var _4Q = _4T.next().value; //#17306
          $k[$j++] = _4Q; //#17306
          $k[$j++] = _4P.get(_4Q); //#17306
          $k[$j++] = Infinity; //#17306
          var _4V = $k[--$j]; //#17306
          var _4W = $k[--$j]; //#17306
          $k[$j++] = _4V; //#17306
          $k[$j++] = $get($1.CNvals, $1.sft1); //#17306
          $k[$j++] = _4W; //#17306
          var _4a = $a(); //#17306
          $k[$j++] = _4a; //#17306
      } //#17306
      var _4b = $1.C2vals; //#17307
      for (var _4g = _4b.size, _4f = _4b.keys(), _4e = 0; _4e < _4g; _4e++) { //#17307
          var _4c = _4f.next().value; //#17307
          $k[$j++] = _4c; //#17307
          $k[$j++] = _4b.get(_4c); //#17307
          $k[$j++] = Infinity; //#17307
          var _4h = $k[--$j]; //#17307
          var _4i = $k[--$j]; //#17307
          $k[$j++] = _4h; //#17307
          $k[$j++] = $get($1.CNvals, $1.sft2); //#17307
          $k[$j++] = _4i; //#17307
          var _4m = $a(); //#17307
          $k[$j++] = _4m; //#17307
      } //#17307
      var _4n = $1.C3vals; //#17308
      for (var _4s = _4n.size, _4r = _4n.keys(), _4q = 0; _4q < _4s; _4q++) { //#17308
          var _4o = _4r.next().value; //#17308
          $k[$j++] = _4o; //#17308
          $k[$j++] = _4n.get(_4o); //#17308
          $k[$j++] = Infinity; //#17308
          var _4t = $k[--$j]; //#17308
          var _4u = $k[--$j]; //#17308
          $k[$j++] = _4t; //#17308
          $k[$j++] = $get($1.CNvals, $1.sft3); //#17308
          $k[$j++] = _4u; //#17308
          var _4y = $a(); //#17308
          $k[$j++] = _4y; //#17308
      } //#17308
      $1.Cvals = $d(); //#17309
      $k[$j++] = Infinity; //#17317
      $k[$j++] = $1.sft1; //#17316
      $k[$j++] = 0; //#17316
      $k[$j++] = $1.sft2; //#17316
      $k[$j++] = 1; //#17316
      $k[$j++] = $1.sft3; //#17316
      $k[$j++] = 2; //#17316
      $k[$j++] = 32; //#17316
      $k[$j++] = 3; //#17316
      for (var _53 = 48; _53 <= 57; _53 += 1) { //#17316
          $k[$j++] = _53; //#17316
          $k[$j++] = _53 - 44; //#17316
      } //#17316
      for (var _54 = 97; _54 <= 122; _54 += 1) { //#17317
          $k[$j++] = _54; //#17317
          $k[$j++] = _54 - 83; //#17317
      } //#17317
      $1.TNvals = $d(); //#17318
      $k[$j++] = Infinity; //#17319
      for (var _56 = 0; _56 <= 31; _56 += 1) { //#17319
          $k[$j++] = _56; //#17319
          $k[$j++] = _56; //#17319
      } //#17319
      $1.T1vals = $d(); //#17319
      $k[$j++] = Infinity; //#17325
      for (var _58 = 33; _58 <= 47; _58 += 1) { //#17321
          $k[$j++] = _58; //#17321
          $k[$j++] = _58 - 33; //#17321
      } //#17321
      for (var _59 = 58; _59 <= 64; _59 += 1) { //#17322
          $k[$j++] = _59; //#17322
          $k[$j++] = _59 - 43; //#17322
      } //#17322
      for (var _5A = 91; _5A <= 95; _5A += 1) { //#17323
          $k[$j++] = _5A; //#17323
          $k[$j++] = _5A - 69; //#17323
      } //#17323
      $k[$j++] = $1.fnc1; //#17325
      $k[$j++] = 27; //#17325
      $k[$j++] = $1.usft; //#17325
      $k[$j++] = 30; //#17325
      $1.T2vals = $d(); //#17326
      $k[$j++] = Infinity; //#17330
      $k[$j++] = 96; //#17329
      $k[$j++] = 0; //#17329
      for (var _5E = 65; _5E <= 90; _5E += 1) { //#17329
          $k[$j++] = _5E; //#17329
          $k[$j++] = _5E - 64; //#17329
      } //#17329
      for (var _5F = 123; _5F <= 127; _5F += 1) { //#17330
          $k[$j++] = _5F; //#17330
          $k[$j++] = _5F - 96; //#17330
      } //#17330
      $1.T3vals = $d(); //#17331
      $k[$j++] = Infinity; //#17336
      var _5H = $1.TNvals; //#17333
      for (var _5M = _5H.size, _5L = _5H.keys(), _5K = 0; _5K < _5M; _5K++) { //#17333
          var _5I = _5L.next().value; //#17333
          $k[$j++] = _5I; //#17333
          $k[$j++] = _5H.get(_5I); //#17333
          $k[$j++] = Infinity; //#17333
          var _5N = $k[--$j]; //#17333
          var _5O = $k[--$j]; //#17333
          $k[$j++] = _5N; //#17333
          $k[$j++] = _5O; //#17333
          var _5P = $a(); //#17333
          $k[$j++] = _5P; //#17333
      } //#17333
      var _5Q = $1.T1vals; //#17334
      for (var _5V = _5Q.size, _5U = _5Q.keys(), _5T = 0; _5T < _5V; _5T++) { //#17334
          var _5R = _5U.next().value; //#17334
          $k[$j++] = _5R; //#17334
          $k[$j++] = _5Q.get(_5R); //#17334
          $k[$j++] = Infinity; //#17334
          var _5W = $k[--$j]; //#17334
          var _5X = $k[--$j]; //#17334
          $k[$j++] = _5W; //#17334
          $k[$j++] = $get($1.TNvals, $1.sft1); //#17334
          $k[$j++] = _5X; //#17334
          var _5b = $a(); //#17334
          $k[$j++] = _5b; //#17334
      } //#17334
      var _5c = $1.T2vals; //#17335
      for (var _5h = _5c.size, _5g = _5c.keys(), _5f = 0; _5f < _5h; _5f++) { //#17335
          var _5d = _5g.next().value; //#17335
          $k[$j++] = _5d; //#17335
          $k[$j++] = _5c.get(_5d); //#17335
          $k[$j++] = Infinity; //#17335
          var _5i = $k[--$j]; //#17335
          var _5j = $k[--$j]; //#17335
          $k[$j++] = _5i; //#17335
          $k[$j++] = $get($1.TNvals, $1.sft2); //#17335
          $k[$j++] = _5j; //#17335
          var _5n = $a(); //#17335
          $k[$j++] = _5n; //#17335
      } //#17335
      var _5o = $1.T3vals; //#17336
      for (var _5t = _5o.size, _5s = _5o.keys(), _5r = 0; _5r < _5t; _5r++) { //#17336
          var _5p = _5s.next().value; //#17336
          $k[$j++] = _5p; //#17336
          $k[$j++] = _5o.get(_5p); //#17336
          $k[$j++] = Infinity; //#17336
          var _5u = $k[--$j]; //#17336
          var _5v = $k[--$j]; //#17336
          $k[$j++] = _5u; //#17336
          $k[$j++] = $get($1.TNvals, $1.sft3); //#17336
          $k[$j++] = _5v; //#17336
          var _5z = $a(); //#17336
          $k[$j++] = _5z; //#17336
      } //#17336
      $1.Tvals = $d(); //#17337
      for (var _61 = 128; _61 <= 255; _61 += 1) { //#17345
          $1.i = _61; //#17341
          $k[$j++] = $1.Avals; //#17342
          $k[$j++] = $1.i; //#17342
          $k[$j++] = Infinity; //#17342
          $aload($get($1.Avals, $1.usft)); //#17342
          $aload($get($1.Avals, $1.i - 128)); //#17342
          var _6A = $a(); //#17342
          var _6B = $k[--$j]; //#17342
          $put($k[--$j], _6B, _6A); //#17342
          $k[$j++] = $1.Cvals; //#17343
          $k[$j++] = $1.i; //#17343
          $k[$j++] = Infinity; //#17343
          $aload($get($1.Cvals, $1.usft)); //#17343
          $aload($get($1.Cvals, $1.i - 128)); //#17343
          var _6L = $a(); //#17343
          var _6M = $k[--$j]; //#17343
          $put($k[--$j], _6M, _6L); //#17343
          $k[$j++] = $1.Tvals; //#17344
          $k[$j++] = $1.i; //#17344
          $k[$j++] = Infinity; //#17344
          $aload($get($1.Tvals, $1.usft)); //#17344
          $aload($get($1.Tvals, $1.i - 128)); //#17344
          var _6W = $a(); //#17344
          var _6X = $k[--$j]; //#17344
          $put($k[--$j], _6X, _6W); //#17344
      } //#17344
      $k[$j++] = Infinity; //#17353
      $k[$j++] = 13; //#17352
      $k[$j++] = 0; //#17352
      $k[$j++] = 42; //#17352
      $k[$j++] = 1; //#17352
      $k[$j++] = 62; //#17352
      $k[$j++] = 2; //#17352
      $k[$j++] = 32; //#17352
      $k[$j++] = 3; //#17352
      for (var _6Z = 48; _6Z <= 57; _6Z += 1) { //#17352
          $k[$j++] = _6Z; //#17352
          $k[$j++] = _6Z - 44; //#17352
      } //#17352
      for (var _6a = 65; _6a <= 90; _6a += 1) { //#17353
          $k[$j++] = _6a; //#17353
          $k[$j++] = _6a - 51; //#17353
      } //#17353
      $1.Xvals = $d(); //#17354
      $k[$j++] = Infinity; //#17356
      var _6c = $1.Xvals; //#17356
      for (var _6h = _6c.size, _6g = _6c.keys(), _6f = 0; _6f < _6h; _6f++) { //#17356
          var _6d = _6g.next().value; //#17356
          $k[$j++] = _6d; //#17356
          $k[$j++] = _6c.get(_6d); //#17356
          $k[$j++] = Infinity; //#17356
          var _6i = $k[--$j]; //#17356
          var _6j = $k[--$j]; //#17356
          $k[$j++] = _6i; //#17356
          $k[$j++] = _6j; //#17356
          var _6k = $a(); //#17356
          $k[$j++] = _6k; //#17356
      } //#17356
      $1.Xvals = $d(); //#17357
      $k[$j++] = Infinity; //#17362
      for (var _6m = 64; _6m <= 94; _6m += 1) { //#17360
          $k[$j++] = _6m; //#17360
          $k[$j++] = _6m - 64; //#17360
      } //#17360
      $k[$j++] = $1.unl; //#17362
      $k[$j++] = 31; //#17362
      for (var _6o = 32; _6o <= 63; _6o += 1) { //#17362
          $k[$j++] = _6o; //#17362
          $k[$j++] = _6o; //#17362
      } //#17362
      $1.Evals = $d(); //#17363
      $k[$j++] = Infinity; //#17365
      var _6q = $1.Evals; //#17365
      for (var _6v = _6q.size, _6u = _6q.keys(), _6t = 0; _6t < _6v; _6t++) { //#17365
          var _6r = _6u.next().value; //#17365
          $k[$j++] = _6r; //#17365
          $k[$j++] = _6q.get(_6r); //#17365
          $k[$j++] = Infinity; //#17365
          var _6w = $k[--$j]; //#17365
          var _6x = $k[--$j]; //#17365
          $k[$j++] = _6w; //#17365
          $k[$j++] = _6x; //#17365
          var _6y = $a(); //#17365
          $k[$j++] = _6y; //#17365
      } //#17365
      $1.Evals = $d(); //#17366
      $k[$j++] = Infinity; //#17369
      for (var _70 = 0; _70 <= 255; _70 += 1) { //#17369
          $k[$j++] = _70; //#17369
          $k[$j++] = _70; //#17369
      } //#17369
      $1.Bvals = $d(); //#17370
      $k[$j++] = Infinity; //#17372
      var _72 = $1.Bvals; //#17372
      for (var _77 = _72.size, _76 = _72.keys(), _75 = 0; _75 < _77; _75++) { //#17372
          var _73 = _76.next().value; //#17372
          $k[$j++] = _73; //#17372
          $k[$j++] = _72.get(_73); //#17372
          $k[$j++] = Infinity; //#17372
          var _78 = $k[--$j]; //#17372
          var _79 = $k[--$j]; //#17372
          $k[$j++] = _78; //#17372
          $k[$j++] = _79; //#17372
          var _7A = $a(); //#17372
          $k[$j++] = _7A; //#17372
      } //#17372
      $1.Bvals = $d(); //#17373
      $1.encvals = $a([$1.Avals, $1.Cvals, $1.Tvals, $1.Xvals, $1.Evals, $1.Bvals]); //#17375
      $k[$j++] = Infinity; //#17377
      for (var _7K = 0, _7L = $1.msglen; _7K < _7L; _7K++) { //#17377
          $k[$j++] = 0; //#17377
      } //#17377
      $k[$j++] = 0; //#17377
      $1.numD = $a(); //#17377
      $k[$j++] = Infinity; //#17378
      for (var _7O = 0, _7P = $1.msglen; _7O < _7P; _7O++) { //#17378
          $k[$j++] = 0; //#17378
      } //#17378
      $k[$j++] = 9999; //#17378
      $1.nextXterm = $a(); //#17378
      $k[$j++] = Infinity; //#17379
      for (var _7S = 0, _7T = $1.msglen; _7S < _7T; _7S++) { //#17379
          $k[$j++] = 0; //#17379
      } //#17379
      $k[$j++] = 9999; //#17379
      $1.nextNonX = $a(); //#17379
      $k[$j++] = Infinity; //#17380
      for (var _7W = 0, _7X = $1.msglen; _7W < _7X; _7W++) { //#17380
          $k[$j++] = false; //#17380
      } //#17380
      $k[$j++] = false; //#17380
      $1.isECI = $a(); //#17380
      for (var _7a = $1.msglen - 1; _7a >= 0; _7a -= 1) { //#17398
          $1.i = _7a; //#17382
          $1.barchar = $get($1.msg, $1.i); //#17383
          if (($1.barchar >= 48) && ($1.barchar <= 57)) { //#17386
              $put($1.numD, $1.i, $f($get($1.numD, $1.i + 1) + 1)); //#17385
          } //#17385
          if ((($1.barchar == 13) || ($1.barchar == 42)) || ($1.barchar == 62)) { //#17390
              $put($1.nextXterm, $1.i, 0); //#17388
          } else { //#17390
              $put($1.nextXterm, $1.i, $f($get($1.nextXterm, $1.i + 1) + 1)); //#17390
          } //#17390
          var _7x = $get($1.Xvals, $1.barchar) !== undefined; //#17392
          if (!_7x) { //#17395
              $put($1.nextNonX, $1.i, 0); //#17393
          } else { //#17395
              $put($1.nextNonX, $1.i, $f($get($1.nextNonX, $1.i + 1) + 1)); //#17395
          } //#17395
          $put($1.isECI, $1.i, $1.barchar <= -1000000); //#17397
      } //#17397
      $k[$j++] = Infinity; //#17399
      var _88 = $1.nextXterm; //#17399
      for (var _89 = 0, _8A = _88.length; _89 < _8A; _89++) { //#17399
          var _8B = $get(_88, _89); //#17399
          $k[$j++] = _8B; //#17399
          if (_8B > 10000) { //#17399
              $j--; //#17399
              $k[$j++] = 10000; //#17399
          } //#17399
      } //#17399
      $1.nextXterm = $a(); //#17399
      $k[$j++] = Infinity; //#17400
      var _8D = $1.nextNonX; //#17400
      for (var _8E = 0, _8F = _8D.length; _8E < _8F; _8E++) { //#17400
          var _8G = $get(_8D, _8E); //#17400
          $k[$j++] = _8G; //#17400
          if (_8G > 10000) { //#17400
              $j--; //#17400
              $k[$j++] = 10000; //#17400
          } //#17400
      } //#17400
      $1.nextNonX = $a(); //#17400
      $1.isD = function() {
          $k[$j++] = ($1.char >= 48) && ($1.char <= 57); //#17402
      }; //#17402
      $1.isC = function() {
          var _8M = $get($1.CNvals, $1.char) !== undefined; //#17403
          $k[$j++] = _8M; //#17403
      }; //#17403
      $1.isT = function() {
          var _8P = $get($1.TNvals, $1.char) !== undefined; //#17404
          $k[$j++] = _8P; //#17404
      }; //#17404
      $1.isX = function() {
          var _8S = $get($1.Xvals, $1.char) !== undefined; //#17405
          $k[$j++] = _8S; //#17405
      }; //#17405
      $1.isE = function() {
          var _8V = $get($1.Evals, $1.char) !== undefined; //#17406
          $k[$j++] = _8V; //#17406
      }; //#17406
      $1.isEA = function() {
          $k[$j++] = $1.char > 127; //#17407
      }; //#17407
      $1.isFN = function() {
          $k[$j++] = $1.char < 0; //#17408
      }; //#17408
      $1.XtermFirst = function() {
          var _8Y = $k[--$j]; //#17409
          $k[$j++] = $lt($get($1.nextXterm, _8Y), $get($1.nextNonX, _8Y)); //#17409
      }; //#17409
      $1.A = 0; //#17411
      $1.C = 1; //#17411
      $1.T = 2; //#17411
      $1.X = 3; //#17411
      $1.E = 4; //#17411
      $1.B = 5; //#17411
      $1.lookup = function() {
          $1.ac = 1; //#17414
          $1.cc = 2; //#17414
          $1.tc = 2; //#17414
          $1.xc = 2; //#17414
          $1.ec = 2; //#17414
          $1.bc = 2.25; //#17414
          if ($1.mode == $1.A) { //#17415
              $1.ac = 0; //#17415
              $1.cc = 1; //#17415
              $1.tc = 1; //#17415
              $1.xc = 1; //#17415
              $1.ec = 1; //#17415
              $1.bc = 1.25; //#17415
          } //#17415
          if ($1.mode == $1.C) { //#17416
              $1.cc = 0; //#17416
          } //#17416
          if ($1.mode == $1.T) { //#17417
              $1.tc = 0; //#17417
          } //#17417
          if ($1.mode == $1.X) { //#17418
              $1.xc = 0; //#17418
          } //#17418
          if ($1.mode == $1.E) { //#17419
              $1.ec = 0; //#17419
          } //#17419
          if ($1.mode == $1.B) { //#17420
              $1.bc = 0; //#17420
          } //#17420
          for (var _8p = 0, _8q = 1; _8p < _8q; _8p++) { //#17455
              if ($get($1.isECI, $1.i)) { //#17422
                  $k[$j++] = $1.A; //#17422
                  break; //#17422
              } //#17422
              if ($1.mailmark && ($1.i < 45)) { //#17423
                  $k[$j++] = $1.C; //#17423
                  break; //#17423
              } //#17423
              $1.k = 0; //#17424
              for (;;) { //#17454
                  if (($1.i + $1.k) == $1.msglen) { //#17433
                      var _91 = $a(['ac', 'cc', 'tc', 'xc', 'ec', 'bc']); //#17426
                      for (var _92 = 0, _93 = _91.length; _92 < _93; _92++) { //#17426
                          var _94 = $get(_91, _92); //#17426
                          $1[_94] = Math.ceil($1[_94]); //#17426
                      } //#17426
                      var _9B = $a([$1.cc, $1.tc, $1.xc, $1.ec, $1.bc]); //#17427
                      $k[$j++] = true; //#17427
                      for (var _9C = 0, _9D = _9B.length; _9C < _9D; _9C++) { //#17427
                          var _9G = $k[--$j]; //#17427
                          $k[$j++] = _9G && ($1.ac <= $get(_9B, _9C)); //#17427
                      } //#17427
                      if ($k[--$j]) { //#17427
                          $k[$j++] = $1.A; //#17427
                          break; //#17427
                      } //#17427
                      var _9O = $a([$1.ac, $1.cc, $1.tc, $1.xc, $1.ec]); //#17428
                      $k[$j++] = true; //#17428
                      for (var _9P = 0, _9Q = _9O.length; _9P < _9Q; _9P++) { //#17428
                          var _9T = $k[--$j]; //#17428
                          $k[$j++] = _9T && ($1.bc < $get(_9O, _9P)); //#17428
                      } //#17428
                      if ($k[--$j]) { //#17428
                          $k[$j++] = $1.B; //#17428
                          break; //#17428
                      } //#17428
                      var _9b = $a([$1.ac, $1.cc, $1.tc, $1.xc, $1.bc]); //#17429
                      $k[$j++] = true; //#17429
                      for (var _9c = 0, _9d = _9b.length; _9c < _9d; _9c++) { //#17429
                          var _9g = $k[--$j]; //#17429
                          $k[$j++] = _9g && ($1.ec < $get(_9b, _9c)); //#17429
                      } //#17429
                      if ($k[--$j]) { //#17429
                          $k[$j++] = $1.E; //#17429
                          break; //#17429
                      } //#17429
                      var _9o = $a([$1.ac, $1.cc, $1.xc, $1.ec, $1.bc]); //#17430
                      $k[$j++] = true; //#17430
                      for (var _9p = 0, _9q = _9o.length; _9p < _9q; _9p++) { //#17430
                          var _9t = $k[--$j]; //#17430
                          $k[$j++] = _9t && ($1.tc < $get(_9o, _9p)); //#17430
                      } //#17430
                      if ($k[--$j]) { //#17430
                          $k[$j++] = $1.T; //#17430
                          break; //#17430
                      } //#17430
                      var _A1 = $a([$1.ac, $1.cc, $1.tc, $1.ec, $1.bc]); //#17431
                      $k[$j++] = true; //#17431
                      for (var _A2 = 0, _A3 = _A1.length; _A2 < _A3; _A2++) { //#17431
                          var _A6 = $k[--$j]; //#17431
                          $k[$j++] = _A6 && ($1.xc < $get(_A1, _A2)); //#17431
                      } //#17431
                      if ($k[--$j]) { //#17431
                          $k[$j++] = $1.X; //#17431
                          break; //#17431
                      } //#17431
                      $k[$j++] = $1.C; //#17432
                      break; //#17432
                  } //#17432
                  $1.char = $get($1.msg, $1.i + $1.k); //#17434
                  $k[$j++] = 'ac'; //#17435
                  $k[$j++] = $1.ac; //#17435
                  $1.isD(); //#17435
                  if ($k[--$j]) { //#17435
                      var _AG = $k[--$j]; //#17435
                      $k[$j++] = $f(_AG + (1 / 2)); //#17435
                  } else { //#17435
                      $1.isEA(); //#17435
                      if ($k[--$j]) { //#17435
                          var _AI = $k[--$j]; //#17435
                          $k[$j++] = Math.ceil(_AI) + 2; //#17435
                      } else { //#17435
                          var _AJ = $k[--$j]; //#17435
                          $k[$j++] = Math.ceil(_AJ) + 1; //#17435
                      } //#17435
                  } //#17435
                  var _AK = $k[--$j]; //#17435
                  $1[$k[--$j]] = _AK; //#17435
                  $k[$j++] = 'cc'; //#17436
                  $k[$j++] = $1.cc; //#17436
                  $1.isC(); //#17436
                  if ($k[--$j]) { //#17436
                      var _AO = $k[--$j]; //#17436
                      $k[$j++] = $f(_AO + 0.66666667); //#17436
                  } else { //#17436
                      $1.isEA(); //#17436
                      if ($k[--$j]) { //#17436
                          var _AQ = $k[--$j]; //#17436
                          $k[$j++] = $f(_AQ + 2.66666667); //#17436
                      } else { //#17436
                          var _AR = $k[--$j]; //#17436
                          $k[$j++] = $f(_AR + 1.33333334); //#17436
                      } //#17436
                  } //#17436
                  var _AS = $k[--$j]; //#17436
                  $1[$k[--$j]] = _AS; //#17436
                  $k[$j++] = 'tc'; //#17437
                  $k[$j++] = $1.tc; //#17437
                  $1.isT(); //#17437
                  if ($k[--$j]) { //#17437
                      var _AW = $k[--$j]; //#17437
                      $k[$j++] = $f(_AW + 0.66666667); //#17437
                  } else { //#17437
                      $1.isEA(); //#17437
                      if ($k[--$j]) { //#17437
                          var _AY = $k[--$j]; //#17437
                          $k[$j++] = $f(_AY + 2.66666667); //#17437
                      } else { //#17437
                          var _AZ = $k[--$j]; //#17437
                          $k[$j++] = $f(_AZ + 1.33333334); //#17437
                      } //#17437
                  } //#17437
                  var _Aa = $k[--$j]; //#17437
                  $1[$k[--$j]] = _Aa; //#17437
                  $k[$j++] = 'xc'; //#17438
                  $k[$j++] = $1.xc; //#17438
                  $1.isX(); //#17438
                  if ($k[--$j]) { //#17438
                      var _Ae = $k[--$j]; //#17438
                      $k[$j++] = $f(_Ae + 0.66666667); //#17438
                  } else { //#17438
                      $1.isEA(); //#17438
                      if ($k[--$j]) { //#17438
                          var _Ag = $k[--$j]; //#17438
                          $k[$j++] = $f(_Ag + 4.33333334); //#17438
                      } else { //#17438
                          var _Ah = $k[--$j]; //#17438
                          $k[$j++] = $f(_Ah + 3.33333334); //#17438
                      } //#17438
                  } //#17438
                  var _Ai = $k[--$j]; //#17438
                  $1[$k[--$j]] = _Ai; //#17438
                  $k[$j++] = 'ec'; //#17439
                  $k[$j++] = $1.ec; //#17439
                  $1.isE(); //#17439
                  if ($k[--$j]) { //#17439
                      var _Am = $k[--$j]; //#17439
                      $k[$j++] = $f(_Am + (3 / 4)); //#17439
                  } else { //#17439
                      $1.isEA(); //#17439
                      if ($k[--$j]) { //#17439
                          var _Ao = $k[--$j]; //#17439
                          $k[$j++] = $f(_Ao + (17 / 4)); //#17439
                      } else { //#17439
                          var _Ap = $k[--$j]; //#17439
                          $k[$j++] = $f(_Ap + (13 / 4)); //#17439
                      } //#17439
                  } //#17439
                  var _Aq = $k[--$j]; //#17439
                  $1[$k[--$j]] = _Aq; //#17439
                  $k[$j++] = 'bc'; //#17440
                  $k[$j++] = $1.bc; //#17440
                  $1.isFN(); //#17440
                  if ($k[--$j]) { //#17440
                      var _Au = $k[--$j]; //#17440
                      $k[$j++] = $f(_Au + 4); //#17440
                  } else { //#17440
                      var _Av = $k[--$j]; //#17440
                      $k[$j++] = $f(_Av + 1); //#17440
                  } //#17440
                  var _Aw = $k[--$j]; //#17440
                  $1[$k[--$j]] = _Aw; //#17440
                  if ($1.k >= 4) { //#17452
                      var _B4 = $a([$1.cc, $1.tc, $1.xc, $1.ec, $1.bc]); //#17442
                      $k[$j++] = true; //#17442
                      for (var _B5 = 0, _B6 = _B4.length; _B5 < _B6; _B5++) { //#17442
                          var _B9 = $k[--$j]; //#17442
                          $k[$j++] = _B9 && (($1.ac + 1) <= $get(_B4, _B5)); //#17442
                      } //#17442
                      if ($k[--$j]) { //#17442
                          $k[$j++] = $1.A; //#17442
                          break; //#17442
                      } //#17442
                      if (($1.bc + 1) <= $1.ac) { //#17443
                          $k[$j++] = $1.B; //#17443
                          break; //#17443
                      } //#17443
                      var _BJ = $a([$1.cc, $1.tc, $1.xc, $1.ec]); //#17444
                      $k[$j++] = true; //#17444
                      for (var _BK = 0, _BL = _BJ.length; _BK < _BL; _BK++) { //#17444
                          var _BO = $k[--$j]; //#17444
                          $k[$j++] = _BO && (($1.bc + 1) < $get(_BJ, _BK)); //#17444
                      } //#17444
                      if ($k[--$j]) { //#17444
                          $k[$j++] = $1.B; //#17444
                          break; //#17444
                      } //#17444
                      var _BW = $a([$1.ac, $1.cc, $1.tc, $1.xc, $1.bc]); //#17445
                      $k[$j++] = true; //#17445
                      for (var _BX = 0, _BY = _BW.length; _BX < _BY; _BX++) { //#17445
                          var _Bb = $k[--$j]; //#17445
                          $k[$j++] = _Bb && (($1.ec + 1) < $get(_BW, _BX)); //#17445
                      } //#17445
                      if ($k[--$j]) { //#17445
                          $k[$j++] = $1.E; //#17445
                          break; //#17445
                      } //#17445
                      var _Bj = $a([$1.ac, $1.cc, $1.xc, $1.ec, $1.bc]); //#17446
                      $k[$j++] = true; //#17446
                      for (var _Bk = 0, _Bl = _Bj.length; _Bk < _Bl; _Bk++) { //#17446
                          var _Bo = $k[--$j]; //#17446
                          $k[$j++] = _Bo && (($1.tc + 1) < $get(_Bj, _Bk)); //#17446
                      } //#17446
                      if ($k[--$j]) { //#17446
                          $k[$j++] = $1.T; //#17446
                          break; //#17446
                      } //#17446
                      var _Bw = $a([$1.ac, $1.cc, $1.tc, $1.ec, $1.bc]); //#17447
                      $k[$j++] = true; //#17447
                      for (var _Bx = 0, _By = _Bw.length; _Bx < _By; _Bx++) { //#17447
                          var _C1 = $k[--$j]; //#17447
                          $k[$j++] = _C1 && (($1.xc + 1) < $get(_Bw, _Bx)); //#17447
                      } //#17447
                      if ($k[--$j]) { //#17447
                          $k[$j++] = $1.X; //#17447
                          break; //#17447
                      } //#17447
                      var _C8 = $a([$1.ac, $1.tc, $1.ec, $1.bc]); //#17448
                      $k[$j++] = true; //#17448
                      for (var _C9 = 0, _CA = _C8.length; _C9 < _CA; _C9++) { //#17448
                          var _CD = $k[--$j]; //#17448
                          $k[$j++] = _CD && (($1.cc + 1) < $get(_C8, _C9)); //#17448
                      } //#17448
                      if ($k[--$j]) { //#17451
                          if ($1.cc < $1.xc) { //#17449
                              $k[$j++] = $1.C; //#17449
                              break; //#17449
                          } //#17449
                          if ($1.cc == $1.xc) { //#17450
                              $k[$j++] = ($1.i + $1.k) + 1; //#17450
                              $1.XtermFirst(); //#17450
                              if ($k[--$j]) { //#17450
                                  $k[$j++] = $1.X; //#17450
                                  break; //#17450
                              } else { //#17450
                                  $k[$j++] = $1.C; //#17450
                                  break; //#17450
                              } //#17450
                          } //#17450
                      } //#17450
                  } //#17450
                  $1.k = $1.k + 1; //#17453
              } //#17453
          } //#17453
      }; //#17456
      $1.addtocws = function() {
          var _CQ = $k[--$j]; //#17459
          $puti($1.cws, $1.j, _CQ); //#17459
          $1.j = _CQ.length + $1.j; //#17460
      }; //#17461
      $1.ECItocws = function() {
          var _CV = $f((-$k[--$j]) - 1000000); //#17465
          $k[$j++] = _CV; //#17479
          if (_CV <= 126) { //#17478
              var _CW = $k[--$j]; //#17466
              $k[$j++] = $f(_CW + 1); //#17467
              $astore($a(1)); //#17467
          } else { //#17478
              var _CY = $k[--$j]; //#17468
              $k[$j++] = _CY; //#17479
              if (_CY <= 16382) { //#17478
                  var _Ca = $f($k[--$j] - 127); //#17470
                  $k[$j++] = (~~(_Ca / 254)) + 128; //#17472
                  $k[$j++] = $f((_Ca % 254) + 1); //#17472
                  $astore($a(2)); //#17472
              } else { //#17478
                  var _Cd = $f($k[--$j] - 16383); //#17475
                  $k[$j++] = (~~(_Cd / 64516)) + 192; //#17478
                  $k[$j++] = ((~~(_Cd / 254)) % 254) + 1; //#17478
                  $k[$j++] = $f((_Cd % 254) + 1); //#17478
                  $astore($a(3)); //#17478
              } //#17478
          } //#17478
      }; //#17480
      $1.encA = function() {
          for (var _Cf = 0, _Cg = 1; _Cf < _Cg; _Cf++) { //#17504
              if ($get($1.isECI, $1.i)) { //#17489
                  $k[$j++] = $get($1.Avals, $1.eci); //#17485
                  $1.addtocws(); //#17485
                  $k[$j++] = $get($1.msg, $1.i); //#17486
                  $1.ECItocws(); //#17486
                  $1.addtocws(); //#17486
                  $1.i = $1.i + 1; //#17487
                  break; //#17488
              } //#17488
              if ($get($1.numD, $1.i) >= 2) { //#17494
                  var _Cu = $s(2); //#17491
                  $put(_Cu, 0, $get($1.msg, $1.i)); //#17491
                  $put(_Cu, 1, $get($1.msg, $1.i + 1)); //#17491
                  $k[$j++] = $get($1.Avals, _Cu); //#17491
                  $1.addtocws(); //#17491
                  $1.i = $1.i + 2; //#17492
                  break; //#17493
              } //#17493
              $k[$j++] = 'newmode'; //#17495
              $1.lookup(); //#17495
              var _D4 = $k[--$j]; //#17495
              $1[$k[--$j]] = _D4; //#17495
              if ($1.newmode != $1.mode) { //#17500
                  $k[$j++] = $get($1.Avals, $get($a([-1, $1.lC, $1.lT, $1.lX, $1.lE, $1.lB]), $1.newmode)); //#17497
                  $1.addtocws(); //#17497
                  $1.mode = $1.newmode; //#17498
                  break; //#17499
              } //#17499
              $k[$j++] = $get($1.Avals, $get($1.msg, $1.i)); //#17501
              $1.addtocws(); //#17501
              $1.i = $1.i + 1; //#17502
              break; //#17503
          } //#17503
      }; //#17505
      $1.CTXvalstocws = function() {
          $1.in = $k[--$j]; //#17508
          $k[$j++] = Infinity; //#17509
          for (var _DS = 0, _DR = $1.in.length - 1; _DS <= _DR; _DS += 3) { //#17513
              var _DU = $geti($1.in, _DS, 3); //#17511
              $k[$j++] = 0; //#17511
              for (var _DV = 0, _DW = _DU.length; _DV < _DW; _DV++) { //#17511
                  var _DY = $k[--$j]; //#17511
                  $k[$j++] = $f(_DY + $get(_DU, _DV)) * 40; //#17511
              } //#17511
              var _Da = (~~($k[--$j] / 40)) + 1; //#17512
              $k[$j++] = ~~(_Da / 256); //#17512
              $k[$j++] = _Da % 256; //#17512
          } //#17512
          $astore($a($counttomark())); //#17514
          var _Dd = $k[--$j]; //#17514
          var _De = $k[--$j]; //#17514
          $k[$j++] = _Dd; //#17514
          $k[$j++] = _De; //#17514
          $j--; //#17514
      }; //#17515
      $1.encCTX = function() {
          $1.p = 0; //#17518
          $1.ctxvals = $a(2500); //#17519
          $1.done = false; //#17520
          for (;;) { //#17597
              if ($1.i == $1.msglen) { //#17524
                  break; //#17524
              } //#17524
              var _Do = $get($get($1.encvals, $1.mode), $get($1.msg, $1.i)) !== undefined; //#17525
              if (!_Do) { //#17525
                  break; //#17525
              } //#17525
              if (($1.p % 3) == 0) { //#17592
                  $k[$j++] = 'newmode'; //#17527
                  $1.lookup(); //#17527
                  var _Dq = $k[--$j]; //#17527
                  $1[$k[--$j]] = _Dq; //#17527
                  if ($ne($1.newmode, $1.mode)) { //#17537
                      $k[$j++] = $geti($1.ctxvals, 0, $1.p); //#17529
                      $1.CTXvalstocws(); //#17529
                      $1.addtocws(); //#17529
                      $k[$j++] = $a([$1.unlcw]); //#17530
                      $1.addtocws(); //#17530
                      if ($1.newmode != $1.A) { //#17533
                          $k[$j++] = $get($1.Avals, $get($a([-1, $1.lC, $1.lT, $1.lX, $1.lE, $1.lB]), $1.newmode)); //#17532
                          $1.addtocws(); //#17532
                      } //#17532
                      $1.mode = $1.newmode; //#17534
                      $1.done = true; //#17535
                      break; //#17536
                  } //#17536
                  if (($1.msglen - $1.i) <= 3) { //#17591
                      $1.remcws = $get($1.numremcws, $1.j + ((~~($1.p / 3)) * 2)); //#17539
                      $k[$j++] = Infinity; //#17545
                      var _EM = $geti($1.msg, $1.i, $1.msglen - $1.i); //#17541
                      for (var _EN = 0, _EO = _EM.length; _EN < _EO; _EN++) { //#17547
                          var _EP = $get(_EM, _EN); //#17547
                          var _ET = $get($get($1.encvals, $1.mode), _EP) !== undefined; //#17542
                          $k[$j++] = _EP; //#17546
                          if (_ET) { //#17545
                              $aload($get($get($1.encvals, $1.mode), $k[--$j])); //#17543
                          } else { //#17545
                              $j--; //#17545
                              $k[$j++] = -1; //#17545
                              $k[$j++] = -1; //#17545
                              $k[$j++] = -1; //#17545
                              $k[$j++] = -1; //#17545
                          } //#17545
                      } //#17545
                      $1.remvals = $a(); //#17545
                      if (($1.remcws == 2) && ($1.remvals.length == 3)) { //#17559
                          $k[$j++] = Infinity; //#17553
                          $aload($geti($1.ctxvals, 0, $1.p)); //#17552
                          $aload($1.remvals); //#17553
                          var _Eg = $a(); //#17553
                          $k[$j++] = _Eg; //#17554
                          $1.CTXvalstocws(); //#17554
                          $1.addtocws(); //#17554
                          $1.mode = $1.A; //#17555
                          $1.i = $1.msglen; //#17556
                          $1.done = true; //#17557
                          break; //#17558
                      } //#17558
                      if ((($1.remcws == 2) && ($1.remvals.length == 2)) && ($1.mode != $1.X)) { //#17571
                          $k[$j++] = Infinity; //#17565
                          $aload($geti($1.ctxvals, 0, $1.p)); //#17563
                          $aload($1.remvals); //#17564
                          $aload($get($get($1.encvals, $1.mode), $1.sft1)); //#17565
                          var _Ew = $a(); //#17565
                          $k[$j++] = _Ew; //#17566
                          $1.CTXvalstocws(); //#17566
                          $1.addtocws(); //#17566
                          $1.mode = $1.A; //#17567
                          $1.i = $1.msglen; //#17568
                          $1.done = true; //#17569
                          break; //#17570
                      } //#17570
                      if (($1.remcws == 2) && ($1.remvals.length == 1)) { //#17581
                          $k[$j++] = $geti($1.ctxvals, 0, $1.p); //#17574
                          $1.CTXvalstocws(); //#17574
                          $1.addtocws(); //#17574
                          $k[$j++] = $a([$1.unlcw]); //#17575
                          $1.addtocws(); //#17575
                          $k[$j++] = $get($1.Avals, $get($1.msg, $1.i)); //#17576
                          $1.addtocws(); //#17576
                          $1.mode = $1.A; //#17577
                          $1.i = $1.msglen; //#17578
                          $1.done = true; //#17579
                          break; //#17580
                      } //#17580
                      if (($1.remcws == 1) && ($1.remvals.length == 1)) { //#17590
                          $k[$j++] = $geti($1.ctxvals, 0, $1.p); //#17584
                          $1.CTXvalstocws(); //#17584
                          $1.addtocws(); //#17584
                          $k[$j++] = $get($1.Avals, $get($1.msg, $1.i)); //#17585
                          $1.addtocws(); //#17585
                          $1.mode = $1.A; //#17586
                          $1.i = $1.msglen; //#17587
                          $1.done = true; //#17588
                          break; //#17589
                      } //#17589
                  } //#17589
              } //#17589
              var _FV = $get($get($1.encvals, $1.mode), $get($1.msg, $1.i)); //#17593
              $puti($1.ctxvals, $1.p, _FV); //#17594
              $1.p = _FV.length + $1.p; //#17595
              $1.i = $1.i + 1; //#17596
          } //#17596
          if (!$1.done) { //#17621
              for (;;) { //#17605
                  if (($1.p % 3) == 0) { //#17602
                      break; //#17602
                  } //#17602
                  $1.i = $1.i - 1; //#17603
                  $1.p = $1.p - $get($get($1.encvals, $1.mode), $get($1.msg, $1.i)).length; //#17604
              } //#17604
              $k[$j++] = Infinity; //#17607
              $aload($geti($1.ctxvals, 0, $1.p)); //#17607
              var _Fo = $a(); //#17607
              $k[$j++] = _Fo; //#17608
              $1.CTXvalstocws(); //#17608
              $1.addtocws(); //#17608
              $k[$j++] = $a([$1.unlcw]); //#17609
              $1.addtocws(); //#17609
              $1.mode = $1.A; //#17610
              if (($1.i != $1.msglen) && $nt($get($1.isECI, $1.i))) { //#17620
                  if ($get($1.numD, $1.i) >= 2) { //#17618
                      var _G0 = $s(2); //#17614
                      $put(_G0, 0, $get($1.msg, $1.i)); //#17614
                      $put(_G0, 1, $get($1.msg, $1.i + 1)); //#17614
                      $k[$j++] = $get($1.Avals, _G0); //#17614
                      $1.addtocws(); //#17614
                      $1.i = $1.i + 2; //#17615
                  } else { //#17618
                      $k[$j++] = $get($1.Avals, $get($1.msg, $1.i)); //#17617
                      $1.addtocws(); //#17617
                      $1.i = $1.i + 1; //#17618
                  } //#17618
              } //#17618
          } //#17618
      }; //#17623
      $1.Evalstocws = function() {
          $1.in = $k[--$j]; //#17626
          $1.inlen = $1.in.length; //#17627
          $1.outlen = ~~(Math.ceil(($1.in.length / 4) * 3)); //#17628
          $k[$j++] = Infinity; //#17629
          $aload($1.in); //#17629
          $k[$j++] = 0; //#17629
          $k[$j++] = 0; //#17629
          $k[$j++] = 0; //#17629
          $1.in = $a(); //#17629
          $k[$j++] = Infinity; //#17630
          for (var _GN = 0, _GM = $1.inlen - 1; _GN <= _GM; _GN += 4) { //#17636
              var _GP = $geti($1.in, _GN, 4); //#17632
              $k[$j++] = 0; //#17632
              for (var _GQ = 0, _GR = _GP.length; _GQ < _GR; _GQ++) { //#17632
                  var _GT = $k[--$j]; //#17632
                  $k[$j++] = $or(_GT, $get(_GP, _GQ)) << 6; //#17632
              } //#17632
              var _GV = $k[--$j] >>> 6; //#17633
              $k[$j++] = (_GV >>> 16) & 255; //#17635
              $k[$j++] = (_GV >>> 8) & 255; //#17635
              $k[$j++] = _GV & 255; //#17635
          } //#17635
          $astore($a($counttomark())); //#17637
          var _GY = $k[--$j]; //#17637
          var _GZ = $k[--$j]; //#17637
          $k[$j++] = _GY; //#17637
          $k[$j++] = _GZ; //#17637
          $j--; //#17637
          var _Gc = $geti($k[--$j], 0, $1.outlen); //#17638
          $k[$j++] = _Gc; //#17638
      }; //#17639
      $1.encE = function() {
          $1.p = 0; //#17642
          $1.edifactvals = $a(2100); //#17643
          for (;;) { //#17672
              if ($1.i == $1.msglen) { //#17647
                  break; //#17647
              } //#17647
              var _Gk = $get($1.Evals, $get($1.msg, $1.i)) !== undefined; //#17648
              if (!_Gk) { //#17648
                  break; //#17648
              } //#17648
              if (($1.p % 4) == 0) { //#17667
                  if (($1.msglen - $1.i) <= 2) { //#17665
                      $1.remcws = $get($1.numremcws, $1.j + ((~~($1.p / 4)) * 3)); //#17651
                      $k[$j++] = Infinity; //#17654
                      var _Gw = $geti($1.msg, $1.i, $1.msglen - $1.i); //#17653
                      for (var _Gx = 0, _Gy = _Gw.length; _Gx < _Gy; _Gx++) { //#17655
                          $aload($get($1.Avals, $get(_Gw, _Gx))); //#17654
                      } //#17654
                      $1.remvals = $a(); //#17654
                      if ((($1.remcws == 1) || ($1.remcws == 2)) && ($1.remvals.length <= $1.remcws)) { //#17664
                          $k[$j++] = $geti($1.edifactvals, 0, $1.p); //#17659
                          $1.Evalstocws(); //#17659
                          $1.addtocws(); //#17659
                          $k[$j++] = $1.remvals; //#17660
                          $1.addtocws(); //#17660
                          $1.mode = $1.A; //#17661
                          $1.i = $1.msglen; //#17662
                          break; //#17663
                      } //#17663
                  } //#17663
                  $1.lookup(); //#17666
                  if ($k[--$j] != $1.mode) { //#17666
                      break; //#17666
                  } //#17666
              } //#17666
              var _HJ = $get($1.Evals, $get($1.msg, $1.i)); //#17668
              $puti($1.edifactvals, $1.p, _HJ); //#17669
              $1.p = _HJ.length + $1.p; //#17670
              $1.i = $1.i + 1; //#17671
          } //#17671
          if ($1.mode != $1.A) { //#17694
              $1.remcws = $f($get($1.numremcws, ($1.j + ((~~($1.p / 4)) * 3)) - 1) - 1); //#17676
              if (((($1.p % 4) != 0) || ($1.i != $1.msglen)) || ($1.remcws >= 3)) { //#17681
                  var _Ha = $get($1.Evals, $1.unl); //#17678
                  $puti($1.edifactvals, $1.p, _Ha); //#17679
                  $1.p = _Ha.length + $1.p; //#17680
              } //#17680
              $k[$j++] = $geti($1.edifactvals, 0, $1.p); //#17682
              $1.Evalstocws(); //#17682
              $1.addtocws(); //#17682
              $1.mode = $1.A; //#17683
              if (($1.i != $1.msglen) && $nt($get($1.isECI, $1.i))) { //#17693
                  if ($get($1.numD, $1.i) >= 2) { //#17691
                      var _Hq = $s(2); //#17687
                      $put(_Hq, 0, $get($1.msg, $1.i)); //#17687
                      $put(_Hq, 1, $get($1.msg, $1.i + 1)); //#17687
                      $k[$j++] = $get($1.Avals, _Hq); //#17687
                      $1.addtocws(); //#17687
                      $1.i = $1.i + 2; //#17688
                  } else { //#17691
                      $k[$j++] = $get($1.Avals, $get($1.msg, $1.i)); //#17690
                      $1.addtocws(); //#17690
                      $1.i = $1.i + 1; //#17691
                  } //#17691
              } //#17691
          } //#17691
      }; //#17696
      $1.encB = function() {
          $1.p = 0; //#17699
          $1.bvals = $a(1558); //#17699
          for (;;) { //#17705
              if ($1.i == $1.msglen) { //#17700
                  break; //#17700
              } //#17700
              $1.lookup(); //#17701
              if ($k[--$j] != $1.mode) { //#17701
                  break; //#17701
              } //#17701
              $put($1.bvals, $1.p, $get($1.msg, $1.i)); //#17702
              $1.p = $1.p + 1; //#17703
              $1.i = $1.i + 1; //#17704
          } //#17704
          $1.remcws = $f($get($1.numremcws, $1.j + $1.p) - 1); //#17706
          $k[$j++] = Infinity; //#17713
          if (($1.remcws == 0) && ($1.i == $1.msglen)) { //#17711
              $k[$j++] = 0; //#17709
          } else { //#17711
              if ($1.p < 250) { //#17711
                  $k[$j++] = $1.p; //#17711
              } else { //#17711
                  $k[$j++] = (~~($1.p / 250)) + 249; //#17711
                  $k[$j++] = $1.p % 250; //#17711
              } //#17711
          } //#17711
          $aload($geti($1.bvals, 0, $1.p)); //#17713
          $1.bvals = $a(); //#17713
          for (var _IZ = 0, _IY = $1.bvals.length - 1; _IZ <= _IY; _IZ += 1) { //#17720
              $1.p = _IZ; //#17716
              var _If = $f(((((($1.j + $1.p) + 1) * 149) % 255) + 1) + $get($1.bvals, $1.p)); //#17718
              $k[$j++] = _If; //#17718
              if (_If >= 256) { //#17718
                  var _Ig = $k[--$j]; //#17718
                  $k[$j++] = $f(_Ig - 256); //#17718
              } //#17718
              $put($1.bvals, $1.p, $k[--$j]); //#17719
          } //#17719
          $k[$j++] = $1.bvals; //#17721
          $1.addtocws(); //#17721
          $1.mode = $1.A; //#17722
      }; //#17723
      $1.cws = $a(1558); //#17726
      $1.mode = $1.A; //#17727
      $1.i = 0; //#17727
      $1.j = 0; //#17727
      for (;;) { //#17730
          if ($1.i >= $1.msglen) { //#17728
              break; //#17728
          } //#17728
          if ($1[$get($a(['encA', 'encCTX', 'encCTX', 'encCTX', 'encE', 'encB']), $1.mode)]() === true) {
              break;
          } //#17729
      } //#17729
      $1.cws = $geti($1.cws, 0, $1.j); //#17731
  } //#17731
  $1.datlen = $1.cws.length; //#17736
  $1.remcws = $f($get($1.numremcws, $1.j - 1) - 1); //#17737
  if ($1.remcws > 0) { //#17746
      $k[$j++] = Infinity; //#17739
      $aload($1.cws); //#17739
      for (var _J4 = 0, _J5 = $1.remcws; _J4 < _J5; _J4++) { //#17739
          $k[$j++] = 129; //#17739
      } //#17739
      $1.cws = $a(); //#17739
      for (var _JB = $1.datlen + 1, _JA = $f($f($1.datlen + $1.remcws) - 1); _JB <= _JA; _JB += 1) { //#17745
          $1.i = _JB; //#17741
          var _JD = (((($1.i + 1) * 149) % 253) + 1) + 129; //#17743
          $k[$j++] = _JD; //#17743
          if (_JD > 254) { //#17743
              var _JE = $k[--$j]; //#17743
              $k[$j++] = $f(_JE - 254); //#17743
          } //#17743
          $put($1.cws, $1.i, $k[--$j]); //#17744
      } //#17744
  } //#17744
  $1.i = 0; //#17749
  for (;;) { //#17770
      $1.m = $get($1.metrics, $1.i); //#17750
      $1.rows = $get($1.m, 0); //#17751
      $1.cols = $get($1.m, 1); //#17752
      $1.regh = $get($1.m, 2); //#17753
      $1.regv = $get($1.m, 3); //#17754
      $1.rscw = $get($1.m, 4); //#17755
      $1.rsbl = $get($1.m, 5); //#17756
      $1.mrows = $f($1.rows - (2 * $1.regh)); //#17757
      $1.mcols = $f($1.cols - (2 * $1.regv)); //#17758
      $1.rrows = ~~($1.mrows / $1.regh); //#17759
      $1.rcols = ~~($1.mcols / $1.regv); //#17760
      $1.ncws = $f((~~(($1.mrows * $1.mcols) / 8)) - $1.rscw); //#17761
      $1.okay = true; //#17762
      if ($1.cws.length != $1.ncws) { //#17763
          $1.okay = false; //#17763
      } //#17763
      if (($1.urows != 0) && ($1.urows != $1.rows)) { //#17764
          $1.okay = false; //#17764
      } //#17764
      if (($1.ucols != 0) && ($1.ucols != $1.cols)) { //#17765
          $1.okay = false; //#17765
      } //#17765
      if ($eq($1.format, "square") && $ne($1.rows, $1.cols)) { //#17766
          $1.okay = false; //#17766
      } //#17766
      if ($eq($1.format, "rectangle") && $eq($1.rows, $1.cols)) { //#17767
          $1.okay = false; //#17767
      } //#17767
      if ($1.okay) { //#17768
          break; //#17768
      } //#17768
      $1.i = $1.i + 1; //#17769
  } //#17769
  $1.cwbs = $a($1.rsbl); //#17773
  $1.ecbs = $a($1.rsbl); //#17774
  for (var _K4 = 0, _K3 = $f($1.rsbl - 1); _K4 <= _K3; _K4 += 1) { //#17789
      $1.i = _K4; //#17776
      if ($1.cws.length != 1558) { //#17780
          $1.cwbsize = ~~($1.cws.length / $1.rsbl); //#17778
      } else { //#17780
          if ($1.i <= 7) { //#17780
              $1.cwbsize = 156; //#17780
          } else { //#17780
              $1.cwbsize = 155; //#17780
          } //#17780
      } //#17780
      $1.cwb = $a($1.cwbsize); //#17782
      for (var _KD = 0, _KC = $1.cwbsize - 1; _KD <= _KC; _KD += 1) { //#17786
          $1.j = _KD; //#17784
          $put($1.cwb, $1.j, $get($1.cws, $f(($1.j * $1.rsbl) + $1.i))); //#17785
      } //#17785
      $put($1.cwbs, $1.i, $1.cwb); //#17787
      $k[$j++] = $1.ecbs; //#17788
      $k[$j++] = $1.i; //#17788
      $k[$j++] = Infinity; //#17788
      for (var _KS = 0, _KT = ~~($1.rscw / $1.rsbl); _KS < _KT; _KS++) { //#17788
          $k[$j++] = 0; //#17788
      } //#17788
      var _KU = $a(); //#17788
      var _KV = $k[--$j]; //#17788
      $put($k[--$j], _KV, _KU); //#17788
  } //#17788
  $k[$j++] = Infinity; //#17792
  $k[$j++] = 1; //#17792
  for (var _KX = 0, _KY = 255; _KX < _KY; _KX++) { //#17792
      var _KZ = $k[--$j]; //#17792
      var _Ka = _KZ * 2; //#17792
      $k[$j++] = _KZ; //#17792
      $k[$j++] = _Ka; //#17792
      if (_Ka >= 256) { //#17792
          var _Kb = $k[--$j]; //#17792
          $k[$j++] = _Kb ^ 301; //#17792
      } //#17792
  } //#17792
  $1.rsalog = $a(); //#17792
  $1.rslog = $a(256); //#17793
  for (var _Ke = 1; _Ke <= 255; _Ke += 1) { //#17794
      $put($1.rslog, $get($1.rsalog, _Ke), _Ke); //#17794
  } //#17794
  $1.rsprod = function() {
      var _Ki = $k[--$j]; //#17798
      var _Kj = $k[--$j]; //#17798
      $k[$j++] = _Kj; //#17802
      $k[$j++] = _Ki; //#17802
      if ((_Ki != 0) && (_Kj != 0)) { //#17801
          var _Km = $get($1.rslog, $k[--$j]); //#17799
          var _Kr = $get($1.rsalog, $f(_Km + $get($1.rslog, $k[--$j])) % 255); //#17799
          $k[$j++] = _Kr; //#17799
      } else { //#17801
          $j -= 2; //#17801
          $k[$j++] = 0; //#17801
      } //#17801
  }; //#17803
  $k[$j++] = Infinity; //#17806
  $k[$j++] = 1; //#17806
  for (var _Ku = 0, _Kv = ~~($1.rscw / $1.rsbl); _Ku < _Kv; _Ku++) { //#17806
      $k[$j++] = 0; //#17806
  } //#17806
  $1.coeffs = $a(); //#17806
  for (var _L0 = 1, _Kz = ~~($1.rscw / $1.rsbl); _L0 <= _Kz; _L0 += 1) { //#17815
      $1.i = _L0; //#17808
      $put($1.coeffs, $1.i, $get($1.coeffs, $1.i - 1)); //#17809
      for (var _L7 = $1.i - 1; _L7 >= 1; _L7 -= 1) { //#17813
          $1.j = _L7; //#17811
          $k[$j++] = $1.coeffs; //#17812
          $k[$j++] = $1.j; //#17812
          $k[$j++] = $get($1.coeffs, $1.j - 1); //#17812
          $k[$j++] = $get($1.coeffs, $1.j); //#17812
          $k[$j++] = $get($1.rsalog, $1.i); //#17812
          $1.rsprod(); //#17812
          var _LJ = $k[--$j]; //#17812
          var _LK = $k[--$j]; //#17812
          var _LL = $k[--$j]; //#17812
          $put($k[--$j], _LL, $xo(_LK, _LJ)); //#17812
      } //#17812
      $k[$j++] = $1.coeffs; //#17814
      $k[$j++] = 0; //#17814
      $k[$j++] = $get($1.coeffs, 0); //#17814
      $k[$j++] = $get($1.rsalog, $1.i); //#17814
      $1.rsprod(); //#17814
      var _LT = $k[--$j]; //#17814
      var _LU = $k[--$j]; //#17814
      $put($k[--$j], _LU, _LT); //#17814
  } //#17814
  $1.coeffs = $geti($1.coeffs, 0, $1.coeffs.length - 1); //#17816
  for (var _Lb = 0, _La = $1.cwbs.length - 1; _Lb <= _La; _Lb += 1) { //#17832
      $1.i = _Lb; //#17820
      $1.cwb = $get($1.cwbs, $1.i); //#17821
      $1.ecb = $get($1.ecbs, $1.i); //#17822
      for (var _Lk = 0, _Lj = $1.cwb.length - 1; _Lk <= _Lj; _Lk += 1) { //#17831
          $1.t = $xo($get($1.cwb, _Lk), $get($1.ecb, 0)); //#17824
          for (var _Lq = $1.ecb.length - 1; _Lq >= 0; _Lq -= 1) { //#17830
              $1.j = _Lq; //#17826
              $1.p = ($1.ecb.length - $1.j) - 1; //#17827
              $k[$j++] = $1.ecb; //#17828
              $k[$j++] = $1.p; //#17828
              $k[$j++] = $1.t; //#17828
              $k[$j++] = $get($1.coeffs, $1.j); //#17828
              $1.rsprod(); //#17828
              var _Lz = $k[--$j]; //#17828
              var _M0 = $k[--$j]; //#17828
              $put($k[--$j], _M0, _Lz); //#17828
              if ($1.j > 0) { //#17829
                  $put($1.ecb, $1.p, $xo($get($1.ecb, $1.p + 1), $get($1.ecb, $1.p))); //#17829
              } //#17829
          } //#17829
      } //#17829
  } //#17829
  if ($1.ncws == 1558) { //#17837
      $k[$j++] = Infinity; //#17836
      var _MD = $geti($1.ecbs, 8, 2); //#17836
      for (var _ME = 0, _MF = _MD.length; _ME < _MF; _ME++) { //#17836
          $k[$j++] = $get(_MD, _ME); //#17836
      } //#17836
      var _MI = $geti($1.ecbs, 0, 8); //#17836
      for (var _MJ = 0, _MK = _MI.length; _MJ < _MK; _MJ++) { //#17836
          $k[$j++] = $get(_MI, _MJ); //#17836
      } //#17836
      $1.ecbs = $a(); //#17836
  } //#17836
  $k[$j++] = Infinity; //#17840
  var _MN = $1.cws; //#17840
  for (var _MO = 0, _MP = _MN.length; _MO < _MP; _MO++) { //#17840
      $k[$j++] = $get(_MN, _MO); //#17840
  } //#17840
  for (var _MS = 0, _MT = $1.rscw; _MS < _MT; _MS++) { //#17840
      $k[$j++] = 0; //#17840
  } //#17840
  $1.cws = $a(); //#17840
  for (var _MX = 0, _MW = $f($1.rscw - 1); _MX <= _MW; _MX += 1) { //#17844
      $1.i = _MX; //#17842
      $put($1.cws, $f($1.ncws + $1.i), $get($get($1.ecbs, $1.i % $1.rsbl), ~~($1.i / $1.rsbl))); //#17843
  } //#17843
  $1.module = function() {
      var _Mi = $k[--$j]; //#17849
      var _Mj = $k[--$j]; //#17849
      var _Mk = $k[--$j]; //#17849
      var _Mn = $strcpy($s(8), "00000000"); //#17850
      var _Mp = $cvrs($s(8), $k[--$j], 2); //#17850
      $puti(_Mn, 8 - _Mp.length, _Mp); //#17851
      $k[$j++] = _Mk; //#17852
      $k[$j++] = _Mj; //#17852
      $k[$j++] = _Mi; //#17852
      $k[$j++] = _Mn; //#17852
      for (var _Mq = 7; _Mq >= 0; _Mq -= 1) { //#17852
          var _Mr = $k[--$j]; //#17852
          $k[$j++] = $f($get(_Mr, _Mq) - 48); //#17852
          $k[$j++] = _Mr; //#17852
      } //#17852
      $j--; //#17852
      var _Mt = $k[--$j]; //#17853
      var _Mu = $k[--$j]; //#17853
      var _Mv = $k[--$j]; //#17853
      var _Mw = $k[--$j]; //#17853
      var _Mx = $k[--$j]; //#17853
      var _My = $k[--$j]; //#17853
      var _Mz = $k[--$j]; //#17853
      var _N0 = $k[--$j]; //#17853
      var _N1 = $k[--$j]; //#17853
      var _N2 = $k[--$j]; //#17853
      var _N3 = $k[--$j]; //#17853
      $k[$j++] = _N0; //#17870
      $k[$j++] = _Mz; //#17870
      $k[$j++] = _My; //#17870
      $k[$j++] = _Mx; //#17870
      $k[$j++] = _Mw; //#17870
      $k[$j++] = _Mv; //#17870
      $k[$j++] = _Mu; //#17870
      $k[$j++] = _Mt; //#17870
      $k[$j++] = _N3; //#17870
      $k[$j++] = _N2; //#17870
      $forall(_N1, function() { //#17870
          if ($k[--$j]() === true) {
              return true;
          } //#17856
          var _N5 = $k[--$j]; //#17857
          var _N6 = $k[--$j]; //#17857
          $k[$j++] = _N6; //#17860
          $k[$j++] = _N5; //#17860
          if (_N6 < 0) { //#17860
              var _N7 = $k[--$j]; //#17858
              var _N8 = $k[--$j]; //#17858
              $k[$j++] = $f(_N8 + $1.mrows); //#17859
              $k[$j++] = $f(_N7 + ($f(4 - ($f($1.mrows + 4) % 8)))); //#17859
          } //#17859
          var _NB = $k[--$j]; //#17861
          $k[$j++] = _NB; //#17864
          if (_NB < 0) { //#17864
              var _ND = $k[--$j]; //#17862
              var _NE = $k[--$j]; //#17862
              $k[$j++] = $f(_NE + ($f(4 - ($f($1.mcols + 4) % 8)))); //#17863
              $k[$j++] = $f(_ND + $1.mcols); //#17863
          } //#17863
          var _NG = $k[--$j]; //#17865
          var _NH = $k[--$j]; //#17865
          $k[$j++] = _NH; //#17867
          $k[$j++] = _NG; //#17867
          if (_NH >= $1.mrows) { //#17867
              var _NJ = $k[--$j]; //#17866
              var _NK = $k[--$j]; //#17866
              $k[$j++] = $f(_NK - $1.mrows); //#17866
              $k[$j++] = _NJ; //#17866
          } //#17866
          var _NM = $k[--$j]; //#17868
          var _NN = $k[--$j]; //#17868
          var _NQ = $k[--$j]; //#17869
          var _NR = $k[--$j]; //#17869
          $put($1.mmat, $f(_NM + (_NN * $1.mcols)), $k[--$j]); //#17869
          $k[$j++] = _NR; //#17869
          $k[$j++] = _NQ; //#17869
      }); //#17869
  }; //#17871
  var _Nj = $a([function() {
      var _NT = $k[--$j]; //#17875
      var _NU = $k[--$j]; //#17875
      $k[$j++] = _NU; //#17875
      $k[$j++] = _NT; //#17875
      $k[$j++] = $f(_NU - 2); //#17875
      $k[$j++] = $f(_NT - 2); //#17875
  }, function() {
      var _NV = $k[--$j]; //#17875
      var _NW = $k[--$j]; //#17875
      $k[$j++] = _NW; //#17875
      $k[$j++] = _NV; //#17875
      $k[$j++] = $f(_NW - 2); //#17875
      $k[$j++] = $f(_NV - 1); //#17875
  }, function() {
      var _NX = $k[--$j]; //#17876
      var _NY = $k[--$j]; //#17876
      $k[$j++] = _NY; //#17876
      $k[$j++] = _NX; //#17876
      $k[$j++] = $f(_NY - 1); //#17876
      $k[$j++] = $f(_NX - 2); //#17876
  }, function() {
      var _NZ = $k[--$j]; //#17876
      var _Na = $k[--$j]; //#17876
      $k[$j++] = _Na; //#17876
      $k[$j++] = _NZ; //#17876
      $k[$j++] = $f(_Na - 1); //#17876
      $k[$j++] = $f(_NZ - 1); //#17876
  }, function() {
      var _Nb = $k[--$j]; //#17877
      var _Nc = $k[--$j]; //#17877
      $k[$j++] = _Nc; //#17877
      $k[$j++] = _Nb; //#17877
      $k[$j++] = $f(_Nc - 1); //#17877
      $k[$j++] = _Nb; //#17877
  }, function() {
      var _Nd = $k[--$j]; //#17877
      var _Ne = $k[--$j]; //#17877
      $k[$j++] = _Ne; //#17877
      $k[$j++] = _Nd; //#17877
      $k[$j++] = _Ne; //#17877
      $k[$j++] = $f(_Nd - 2); //#17877
  }, function() {
      var _Nf = $k[--$j]; //#17878
      var _Ng = $k[--$j]; //#17878
      $k[$j++] = _Ng; //#17878
      $k[$j++] = _Nf; //#17878
      $k[$j++] = _Ng; //#17878
      $k[$j++] = $f(_Nf - 1); //#17878
  }, function() {
      var _Nh = $k[--$j]; //#17878
      var _Ni = $k[--$j]; //#17878
      $k[$j++] = _Ni; //#17878
      $k[$j++] = _Nh; //#17878
      $k[$j++] = _Ni; //#17878
      $k[$j++] = _Nh; //#17878
  }]); //#17878
  $1.dmn = _Nj; //#17879
  var _Ns = $a([function() {
      $k[$j++] = $f($1.mrows - 1); //#17882
      $k[$j++] = 0; //#17882
  }, function() {
      $k[$j++] = $f($1.mrows - 1); //#17882
      $k[$j++] = 1; //#17882
  }, function() {
      $k[$j++] = $f($1.mrows - 1); //#17883
      $k[$j++] = 2; //#17883
  }, function() {
      $k[$j++] = 0; //#17883
      $k[$j++] = $f($1.mcols - 2); //#17883
  }, function() {
      $k[$j++] = 0; //#17884
      $k[$j++] = $f($1.mcols - 1); //#17884
  }, function() {
      $k[$j++] = 1; //#17884
      $k[$j++] = $f($1.mcols - 1); //#17884
  }, function() {
      $k[$j++] = 2; //#17885
      $k[$j++] = $f($1.mcols - 1); //#17885
  }, function() {
      $k[$j++] = 3; //#17885
      $k[$j++] = $f($1.mcols - 1); //#17885
  }]); //#17885
  $1.dmc1 = _Ns; //#17886
  var _O1 = $a([function() {
      $k[$j++] = $f($1.mrows - 3); //#17889
      $k[$j++] = 0; //#17889
  }, function() {
      $k[$j++] = $f($1.mrows - 2); //#17889
      $k[$j++] = 0; //#17889
  }, function() {
      $k[$j++] = $f($1.mrows - 1); //#17890
      $k[$j++] = 0; //#17890
  }, function() {
      $k[$j++] = 0; //#17890
      $k[$j++] = $f($1.mcols - 4); //#17890
  }, function() {
      $k[$j++] = 0; //#17891
      $k[$j++] = $f($1.mcols - 3); //#17891
  }, function() {
      $k[$j++] = 0; //#17891
      $k[$j++] = $f($1.mcols - 2); //#17891
  }, function() {
      $k[$j++] = 0; //#17892
      $k[$j++] = $f($1.mcols - 1); //#17892
  }, function() {
      $k[$j++] = 1; //#17892
      $k[$j++] = $f($1.mcols - 1); //#17892
  }]); //#17892
  $1.dmc2 = _O1; //#17893
  var _OA = $a([function() {
      $k[$j++] = $f($1.mrows - 3); //#17896
      $k[$j++] = 0; //#17896
  }, function() {
      $k[$j++] = $f($1.mrows - 2); //#17896
      $k[$j++] = 0; //#17896
  }, function() {
      $k[$j++] = $f($1.mrows - 1); //#17897
      $k[$j++] = 0; //#17897
  }, function() {
      $k[$j++] = 0; //#17897
      $k[$j++] = $f($1.mcols - 2); //#17897
  }, function() {
      $k[$j++] = 0; //#17898
      $k[$j++] = $f($1.mcols - 1); //#17898
  }, function() {
      $k[$j++] = 1; //#17898
      $k[$j++] = $f($1.mcols - 1); //#17898
  }, function() {
      $k[$j++] = 2; //#17899
      $k[$j++] = $f($1.mcols - 1); //#17899
  }, function() {
      $k[$j++] = 3; //#17899
      $k[$j++] = $f($1.mcols - 1); //#17899
  }]); //#17899
  $1.dmc3 = _OA; //#17900
  var _OK = $a([function() {
      $k[$j++] = $f($1.mrows - 1); //#17903
      $k[$j++] = 0; //#17903
  }, function() {
      $k[$j++] = $f($1.mrows - 1); //#17903
      $k[$j++] = $f($1.mcols - 1); //#17903
  }, function() {
      $k[$j++] = 0; //#17904
      $k[$j++] = $f($1.mcols - 3); //#17904
  }, function() {
      $k[$j++] = 0; //#17904
      $k[$j++] = $f($1.mcols - 2); //#17904
  }, function() {
      $k[$j++] = 0; //#17905
      $k[$j++] = $f($1.mcols - 1); //#17905
  }, function() {
      $k[$j++] = 1; //#17905
      $k[$j++] = $f($1.mcols - 3); //#17905
  }, function() {
      $k[$j++] = 1; //#17906
      $k[$j++] = $f($1.mcols - 2); //#17906
  }, function() {
      $k[$j++] = 1; //#17906
      $k[$j++] = $f($1.mcols - 1); //#17906
  }]); //#17906
  $1.dmc4 = _OK; //#17907
  $k[$j++] = Infinity; //#17909
  for (var _ON = 0, _OO = $1.mrows * $1.mcols; _ON < _OO; _ON++) { //#17909
      $k[$j++] = -1; //#17909
  } //#17909
  $1.mmat = $a(); //#17909
  for (var _OR = $1.cws.length - 1; _OR >= 0; _OR -= 1) { //#17910
      $k[$j++] = $get($1.cws, _OR); //#17910
  } //#17910
  $k[$j++] = 4; //#17950
  $k[$j++] = 0; //#17950
  for (;;) { //#17950
      var _OU = $k[--$j]; //#17913
      var _OV = $k[--$j]; //#17913
      $k[$j++] = _OV; //#17915
      $k[$j++] = _OU; //#17915
      if ((_OU == 0) && (_OV == $1.mrows)) { //#17915
          $k[$j++] = $1.dmc1; //#17914
          $1.module(); //#17914
      } //#17914
      var _OY = $k[--$j]; //#17916
      var _OZ = $k[--$j]; //#17916
      $k[$j++] = _OZ; //#17918
      $k[$j++] = _OY; //#17918
      if (((_OY == 0) && (_OZ == $f($1.mrows - 2))) && (($1.mcols % 4) != 0)) { //#17918
          $k[$j++] = $1.dmc2; //#17917
          $1.module(); //#17917
      } //#17917
      var _Od = $k[--$j]; //#17919
      var _Oe = $k[--$j]; //#17919
      $k[$j++] = _Oe; //#17921
      $k[$j++] = _Od; //#17921
      if (((_Od == 0) && (_Oe == $f($1.mrows - 2))) && (($1.mcols % 8) == 4)) { //#17921
          $k[$j++] = $1.dmc3; //#17920
          $1.module(); //#17920
      } //#17920
      var _Oi = $k[--$j]; //#17922
      var _Oj = $k[--$j]; //#17922
      $k[$j++] = _Oj; //#17924
      $k[$j++] = _Oi; //#17924
      if (((_Oi == 2) && (_Oj == $f($1.mrows + 4))) && (($1.mcols % 8) == 0)) { //#17924
          $k[$j++] = $1.dmc4; //#17923
          $1.module(); //#17923
      } //#17923
      for (;;) { //#17934
          var _On = $k[--$j]; //#17927
          var _Oo = $k[--$j]; //#17927
          $k[$j++] = _Oo; //#17931
          $k[$j++] = _On; //#17931
          if ((_On >= 0) && (_Oo < $1.mrows)) { //#17931
              var _Oq = $k[--$j]; //#17928
              var _Or = $k[--$j]; //#17928
              $k[$j++] = _Or; //#17930
              $k[$j++] = _Oq; //#17930
              if ($get($1.mmat, $f(_Oq + (_Or * $1.mcols))) == -1) { //#17930
                  $k[$j++] = $1.dmn; //#17929
                  $1.module(); //#17929
              } //#17929
          } //#17929
          var _Ow = $k[--$j]; //#17932
          var _Ox = $k[--$j]; //#17932
          $k[$j++] = $f(_Ox - 2); //#17933
          $k[$j++] = $f(_Ow + 2); //#17933
          if (!(($f(_Ow + 2) < $1.mcols) && ($f(_Ox - 2) >= 0))) { //#17933
              break; //#17933
          } //#17933
      } //#17933
      var _Oz = $k[--$j]; //#17935
      var _P0 = $k[--$j]; //#17935
      $k[$j++] = $f(_P0 + 1); //#17945
      $k[$j++] = $f(_Oz + 3); //#17945
      for (;;) { //#17945
          var _P1 = $k[--$j]; //#17938
          var _P2 = $k[--$j]; //#17938
          $k[$j++] = _P2; //#17942
          $k[$j++] = _P1; //#17942
          if ((_P1 < $1.mcols) && (_P2 >= 0)) { //#17942
              var _P4 = $k[--$j]; //#17939
              var _P5 = $k[--$j]; //#17939
              $k[$j++] = _P5; //#17941
              $k[$j++] = _P4; //#17941
              if ($get($1.mmat, $f(_P4 + (_P5 * $1.mcols))) == -1) { //#17941
                  $k[$j++] = $1.dmn; //#17940
                  $1.module(); //#17940
              } //#17940
          } //#17940
          var _PA = $k[--$j]; //#17943
          var _PB = $k[--$j]; //#17943
          $k[$j++] = $f(_PB + 2); //#17944
          $k[$j++] = $f(_PA - 2); //#17944
          if (!(($f(_PA - 2) >= 0) && ($f(_PB + 2) < $1.mrows))) { //#17944
              break; //#17944
          } //#17944
      } //#17944
      var _PD = $k[--$j]; //#17946
      var _PE = $k[--$j]; //#17946
      $k[$j++] = $f(_PE + 3); //#17948
      $k[$j++] = $f(_PD + 1); //#17948
      if (!(($f(_PD + 1) < $1.mcols) || ($f(_PE + 3) < $1.mrows))) { //#17948
          $j -= 2; //#17948
          break; //#17948
      } //#17948
  } //#17948
  if ($get($1.mmat, $f(($1.mrows * $1.mcols) - 1)) == -1) { //#17956
      $puti($1.mmat, $f(($1.mrows * $f($1.mcols - 1)) - 2), $a([1, 0])); //#17954
      $puti($1.mmat, $f(($1.mrows * $1.mcols) - 2), $a([0, 1])); //#17955
  } //#17955
  $1.pixs = $a($1.rows * $1.cols); //#17959
  $1.cwpos = 0; //#17960
  for (var _PY = 0, _PX = $f($1.rows - 1); _PY <= _PX; _PY += 1) { //#17976
      $1.i = _PY; //#17962
      if (($1.i % ($1.rrows + 2)) == 0) { //#17963
          $k[$j++] = $1.pixs; //#17963
          $k[$j++] = $1.i * $1.cols; //#17963
          $k[$j++] = Infinity; //#17963
          for (var _Pf = 0, _Pg = ~~($1.cols / 2); _Pf < _Pg; _Pf++) { //#17963
              $k[$j++] = 1; //#17963
              $k[$j++] = 0; //#17963
          } //#17963
          var _Ph = $a(); //#17963
          var _Pi = $k[--$j]; //#17963
          $puti($k[--$j], _Pi, _Ph); //#17963
      } //#17963
      if (($1.i % ($1.rrows + 2)) == ($1.rrows + 1)) { //#17964
          $k[$j++] = $1.pixs; //#17964
          $k[$j++] = $1.i * $1.cols; //#17964
          $k[$j++] = Infinity; //#17964
          for (var _Pr = 0, _Ps = $1.cols; _Pr < _Ps; _Pr++) { //#17964
              $k[$j++] = 1; //#17964
          } //#17964
          var _Pt = $a(); //#17964
          var _Pu = $k[--$j]; //#17964
          $puti($k[--$j], _Pu, _Pt); //#17964
      } //#17964
      if ((($1.i % ($1.rrows + 2)) != 0) && (($1.i % ($1.rrows + 2)) != ($1.rrows + 1))) { //#17975
          for (var _Q3 = 0, _Q2 = $f($1.cols - 1); _Q3 <= _Q2; _Q3 += 1) { //#17974
              $1.j = _Q3; //#17967
              if (($1.j % ($1.rcols + 2)) == 0) { //#17968
                  $put($1.pixs, $f(($1.i * $1.cols) + $1.j), 1); //#17968
              } //#17968
              if (($1.j % ($1.rcols + 2)) == ($1.rcols + 1)) { //#17969
                  $put($1.pixs, $f(($1.i * $1.cols) + $1.j), $1.i % 2); //#17969
              } //#17969
              if ((($1.j % ($1.rcols + 2)) != 0) && (($1.j % ($1.rcols + 2)) != ($1.rcols + 1))) { //#17973
                  $put($1.pixs, $f(($1.i * $1.cols) + $1.j), $get($1.mmat, $1.cwpos)); //#17971
                  $1.cwpos = $1.cwpos + 1; //#17972
              } //#17972
          } //#17972
      } //#17972
  } //#17972
  var _Qb = new Map([
      ["ren", bwipp_renmatrix],
      ["pixs", $1.pixs],
      ["pixx", $1.cols],
      ["pixy", $1.rows],
      ["height", ($1.rows * 2) / 72],
      ["width", ($1.cols * 2) / 72],
      ["opt", $1.options]
  ]); //#17986
  $k[$j++] = _Qb; //#17989
  if (!$1.dontdraw) { //#17989
      bwipp_renmatrix(); //#17989
  } //#17989
}

function DrawingCanvas(opts, canvas) {
	if (typeof window == null) {
		throw new Error('DrawingCanvas: not a browser');
	}

	var img;
	var ctx = canvas.getContext('2d');
	var drawing = DrawingBuiltin(opts);

	// Provide our specializations for the builtin drawing
	drawing.image = image;
	drawing.end = end;

	return drawing;


	// Called by DrawingBuiltin.init() to get the ARGB bitmap for rendering.
	function image(width, height) {
		canvas.width  = width;
		canvas.height = height;

		// Set background 
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		if (/^[0-9a-fA-F]{6}$/.test(''+opts.backgroundcolor)) {
			ctx.fillStyle = '#' + opts.backgroundcolor;
			ctx.fillRect(0, 0, width, height);
		} else {
			ctx.clearRect(0, 0, width, height);
		}

		// Prepare the bitmap 
		img = ctx.getImageData(0, 0, width, height);

		// The return value is designed for both canvas pure-RGBA and PNG RGBA
		return { buffer:img.data, ispng:false };
	}

	function end() {
		ctx.putImageData(img, 0, 0);
	}
}

function DrawingBuiltin(opts) {
	var floor = Math.floor;

	// Unrolled x,y rotate/translate matrix
	var tx0 = 0, tx1 = 0, tx2 = 0, tx3 = 0;
	var ty0 = 0, ty1 = 0, ty2 = 0, ty3 = 0;

	var gs_image, gs_rowbyte;	// rowbyte will be 1 for png's, 0 for canvas
	var gs_width, gs_height;	// image size, in pixels
	var gs_dx, gs_dy;			// x,y translate (padding)
	var gs_r, gs_g, gs_b;		// rgb
	var gs_xymap;				// even-odd edge map

	return {
		// Ensure compliant bar codes by always using integer scaling factors.
		scale : function(sx, sy) {
			return [ (sx|0)||1, (sy|0)||1 ];
		},

		// Measure text.  This and scale() are the only drawing primitives that
		// are called before init().
		//
		// `font` is the font name typically OCR-A or OCR-B.
		// `fwidth` and `fheight` are the requested font cell size.  They will
		// usually be the same, except when the scaling is not symetric.
		measure : function(str, font, fwidth, fheight) {
			fwidth = fwidth|0;
			fheight = fheight|0;

			var fontid = FontLib.lookup(font);
			var width = 0;
			var ascent = 0;
			var descent = 0;
			for (var i = 0, l = str.length; i < l; i++) {
				var ch = str.charCodeAt(i);
				var glyph = FontLib.getglyph(fontid, ch, fwidth, fheight);

				ascent  = Math.max(ascent, glyph.top);
				descent = Math.max(descent, glyph.height - glyph.top);

				if (i == l-1) {
					width += glyph.left + glyph.width;
				} else {
					width += glyph.advance;
				}
			}
			return { width:width, ascent:ascent, descent:descent };
		},

		// width and height represent the maximum bounding box the graphics will occupy.
		// The dimensions are for an unrotated rendering.  Adjust as necessary.
		init : function(width, height) {
			// Add in the effects of padding.  These are always set before the
			// drawing constructor is called.
			var padl = opts.paddingleft;
			var padr = opts.paddingright;
			var padt = opts.paddingtop;
			var padb = opts.paddingbottom;
			var rot  = opts.rotate || 'N';

			width  += padl + padr;
			height += padt + padb;

			if (+opts.sizelimit && +opts.sizelimit < width * height) {
				throw new Error('Image size over limit');
			}

			// Transform indexes are: x, y, w, h
			switch (rot) {
			// tx = w-y, ty = x
			case 'R': tx1 = -1; tx2 = 1; ty0 = 1; break;
			// tx = w-x, ty = h-y
			case 'I': tx0 = -1; tx2 = 1; ty1 = -1; ty3 = 1; break;
			// tx = y, ty = h-x
			case 'L': tx1 = 1; ty0 = -1; ty3 = 1; break;
			// tx = x, ty = y
			default:  tx0 = ty1 = 1; break;
			}

			// Setup the graphics state
			var swap = rot == 'L' || rot == 'R';
			gs_width  = swap ? height : width;
			gs_height = swap ? width : height;
			gs_dx = padl;
			gs_dy = padt;
			gs_xymap = [];
			gs_xymap.min = Infinity;
			gs_r = gs_g = gs_b = 0;

			// Get the rgba image from the constructor
			var res = this.image(gs_width, gs_height);
			gs_image   = res.buffer;
			gs_rowbyte = res.ispng ? 1 : 0;
		},
		// Unconnected stroked lines are used to draw the bars in linear barcodes;
		// and the border around a linear barcode (e.g. ITF-14)
		// No line cap should be applied.  These lines are always orthogonal.
		line : function(x0, y0, x1, y1, lw, rgb) {
			x0 = x0|0;
			y0 = y0|0;
			x1 = x1|0;
			y1 = y1|0;

			// Most linear barcodes, the line width will be integral.  The exceptions
			// are variable width barcodes (e.g. code39) and the postal 4-state codes.
			lw = Math.round(lw) || 1;

			if (y1 < y0) { var t = y0; y0 = y1; y1 = t; }
			if (x1 < x0) { var t = x0; x0 = x1; x1 = t; }

			gs_r = parseInt(rgb.substr(0,2), 16);
			gs_g = parseInt(rgb.substr(2,2), 16);
			gs_b = parseInt(rgb.substr(4,2), 16);

			// Horizontal or vertical line?
			var w2 = (lw/2)|0;
			if (x0 == x1) {
				// Vertical line
				x0 = x0 - lw + w2;  // big half
				x1 = x1 + w2 - 1;   // small half
			} else {
				// Horizontal line (inverted halves)
				y0 = y0 - w2;
				y1 = y1 + lw - w2 - 1;
			}
			for (var y = y0; y <= y1; y++) {
				for (var x = x0; x <= x1; x++) {
					set(x, y, 255);
				}
			}
		},

		// Polygons are used to draw the connected regions in a 2d barcode.
		// These will always be unstroked, filled, non-intersecting,
		// orthogonal shapes.
		// You will see a series of polygon() calls, followed by a fill().
		polygon : function(pts) {
			var npts = pts.length;
			for (var j = npts-1, i = 0; i < npts; j = i++) {
				if (pts[j][0] == pts[i][0]) {
					// Vertical lines do not get their end points. End points
					// are added by the horizontal line logic.
					var xj = pts[j][0]|0;	// i or j, doesn't matter
					var yj = pts[j][1]|0;
					var yi = pts[i][1]|0;
					if (yj > yi) {
						for (var y = yi+1; y < yj; y++) {
							addPoint(xj, y);
						}
					} else {
						for (var y = yj+1; y < yi; y++) {
							addPoint(xj, y);
						}
					}
				} else {
					var xj = pts[j][0]|0;
					var xi = pts[i][0]|0;
					var yj = pts[j][1]|0;	// i or j, doesn't matter

					// Horizontal lines are tricky.  As a rule, top lines get filled,
					// bottom lines do not (similar to how left edges get filled and
					// right edges do not).
					//
					// Where it gets complex is deciding whether the line actually
					// adds edges.  There are cases where a horizontal line does
					// not add anything to the scanline plotting.  And it doesn't
					// actually matter whether the line is a top or bottom edge,
					// the logic is the same.
					//
					// A left edge is added if the edge to its left is below.
					// A right edge is added if the edge to its right is below.
					if (xj < xi) {
						var yl = pts[j == 0 ? npts-1 : j-1][1];	// left edge
						var yr = pts[i == npts-1 ? 0 : i+1][1];	// right edge
						if (yl > yj) {
							addPoint(xj, yj);
						}
						if (yr > yj) {
							addPoint(xi, yj);
						}
					} else {
						var yl = pts[i == npts-1 ? 0 : i+1][1];	// left edge
						var yr = pts[j == 0 ? npts-1 : j-1][1];	// right edge
						if (yl > yj) {
							addPoint(xi, yj);
						}
						if (yr > yj) {
							addPoint(xj, yj);
						}
					}
				}
			}
		},
		// An unstroked, filled hexagon used by maxicode.  You can choose to fill
		// each individually, or wait for the final fill().
		//
		// The hexagon is drawn from the top, counter-clockwise.
		//
		// The X-coordinate for the top and bottom points on the hexagon is always
		// .5 pixels.  We draw our hexagons with a 2 pixel flat top.
		//
		// All other points of the polygon/hexagon are guaranteed to be integer values.
		hexagon : function(pts, rgb) {
			var x = pts[0][0]|0;
			var y = pts[0][1]|0;
			var qh = pts[1][1] - pts[0][1];		// height of triangle (quarter height)
			var vh = pts[2][1] - pts[1][1] - 1;	// height of vertical side
			var xl = pts[2][0];					// left side
			var xr = pts[4][0];					// right side

			gs_r = parseInt(rgb.substr(0,2), 16);
			gs_g = parseInt(rgb.substr(2,2), 16);
			gs_b = parseInt(rgb.substr(4,2), 16);

			fillSegment(x, x+1, y++);
			for (var k = 1; k < qh; k++) {
				fillSegment(x-2*k, x+1+2*k, y++);
			}
			for (var k = 0; k <= vh; k++) {
				fillSegment(xl, xr, y++);
			}
			for (var k = qh-1; k >= 1; k--) {
				fillSegment(x-2*k, x+1+2*k, y++);
			}
			fillSegment(x, x+1, y);
		},
		// An unstroked, filled ellipse.  Used by dotcode and maxicode at present.
		// maxicode issues pairs of ellipse calls (one cw, one ccw) followed by a fill()
		// to create the bullseye rings.  dotcode issues all of its ellipses then a
		// fill().
		ellipse : function(x, y, rx, ry, ccw) {
			drawEllipse(x-rx, y-ry, x+rx, y+ry, ccw);
		},
		// PostScript's default fill rule is even-odd.
		fill : function(rgb) {
			gs_r = parseInt(rgb.substr(0,2), 16);
			gs_g = parseInt(rgb.substr(2,2), 16);
			gs_b = parseInt(rgb.substr(4,2), 16);

			evenodd();
			gs_xymap = [];
			gs_xymap.min = Infinity;
		},
		// Draw text with optional inter-character spacing.  `y` is the baseline.
		// font is an object with properties { name, width, height, dx }
		// width and height are the font cell size.
		// dx is extra space requested between characters (usually zero).
		text : function(x, y, str, rgb, font) {
			x = x|0;
			y = y|0;

			gs_r = parseInt(rgb.substr(0,2), 16);
			gs_g = parseInt(rgb.substr(2,2), 16);
			gs_b = parseInt(rgb.substr(4,2), 16);

			var fontid  = FontLib.lookup(font.name);
			var fwidth  = font.width|0;
			var fheight = font.height|0;
			var dx      = font.dx|0;
			for (var k = 0; k < str.length; k++) {
				var ch = str.charCodeAt(k);
				var glyph = FontLib.getglyph(fontid, ch, fwidth, fheight);

				var gt = y - glyph.top;
				var gl = glyph.left;
				var gw = glyph.width;
				var gh = glyph.height;
				var gb = glyph.bytes;
				var go = glyph.offset;		// offset into bytes

				for (var i = 0; i < gw; i++) {
					for (var j = 0; j < gh; j++) {
						var a = gb[go + j * gw + i];
						if (a) {
							set(x+gl+i, gt+j, a);
						}
					}
				}
				x += glyph.advance + dx;
			}
		},
		// Called after all drawing is complete.
		end : function() {
		},
	};

	// This code is specialized to deal with two types of RGBA buffers:
	// - canvas style, which is true RGBA
	// - PNG style, which has a one-byte "filter code" prefixing each row.
	function set(x, y, a) {
		// translate/rotate
		x += gs_dx;
		y += gs_dy;
		var tx = tx0 * x + tx1 * y + tx2 * (gs_width-1) + tx3 * (gs_height-1);
		var ty = ty0 * x + ty1 * y + ty2 * (gs_width-1) + ty3 * (gs_height-1);

		// https://en.wikipedia.org/wiki/Alpha_compositing
		var offs = (ty * gs_width + tx) * 4 + (ty+1) * gs_rowbyte;
		var dsta = gs_image[offs+3] / 255;
		var srca = a / 255;
		var inva = (1 - srca) * dsta;
		var outa = srca + inva;

		gs_image[offs+0] = ((gs_r * srca + gs_image[offs+0] * inva) / outa)|0;
		gs_image[offs+1] = ((gs_g * srca + gs_image[offs+1] * inva) / outa)|0;
		gs_image[offs+2] = ((gs_b * srca + gs_image[offs+2] * inva) / outa)|0;
		gs_image[offs+3] = (255 * outa)|0;
	}

	// Add a point on an edge to the scanline map.
	function addPoint(x, y) {
		if (gs_xymap.min > y) gs_xymap.min = y;
		if (!gs_xymap[y]) {
			gs_xymap[y] = [ x ];
		} else {
			gs_xymap[y].push(x);
		}
	}

	function fillSegment(x0, x1, y) {
		while (x0 <= x1) {
			set(x0++, y, 255);
		}
	}

	// even-odd fill
	//
	// This implementation is optimized for BWIPP's simple usage.
	// It is not a general purpose scanline fill.  It relies heavily on
	// polygon() creating the correct intersections.
	function evenodd() {
		var ymin = gs_xymap.min;
		var ymax = gs_xymap.length-1;

		for (var y = ymin; y <= ymax; y++) {
			var pts = gs_xymap[y];
			if (!pts) {
				continue
			}
			pts.sort(function(a, b) { return a - b; });

			var wn = false;
			var xl = 0;
			for (var n = 0, npts = pts.length; n < npts; n++) {
				var x = pts[n];
				if (wn) {
					fillSegment(xl, x-1, y);
				} else {
					xl = x;
				}
				wn = !wn;
			}
		}
	}

	function drawEllipse(x0, y0, x1, y1, dir) {
		x0 = x0|0;
		y0 = y0|0;
		x1 = x1|0;
		y1 = y1|0;

		var a = Math.abs(x1-x0);
		var b = Math.abs(y1-y0);
		var b1 = b & 1;
		var dx = 4*(1-a)*b*b;
		var dy = 4*(b1+1)*a*a;
		var err = dx + dy + b1*a*a;
		var e2;

		// Left and right edges
		var left = [], right = [];
		left.min = right.min = Infinity;

		if (x0 > x1) { x0 = x1; x1 += a; }
		if (y0 > y1) y0 = y1;
		y0 += ((b+1)/2)|0;
		y1 = y0 - b1;
		a *= 8*a; b1 = 8*b*b;

		do {
			maxedge(right, x1, y0);	// 1st quadrant
			minedge(left, x0, y0);	// 2nd quadrant
			minedge(left, x0, y1);	// 3rd quadrant
			maxedge(right, x1, y1);	// 4th quadrant
			e2 = 2*err;
			if (e2 >= dx) { x0++; x1--; dx += b1; err += dx; }
			if (e2 <= dy) { y0++; y1--; dy += a;  err += dy; }
		} while (x0 <= x1);

		while (y0-y1 < b) {	// too early stop of flat ellipse
			maxedge(right, x1+1, y0);
			minedge(left, x0-1, y0++);
			minedge(left, x0-1, y1);
			maxedge(right, x1+1, y1--);
		}

		for (var y = left.min, max = left.length-1; y <= max; y++) {
			addPoint(left[y], y);
		}
		// The points we calculated are "inside".  The fill algorithm excludes 
		// right edges, so +1 on each x.
		for (var y = right.min, max = right.length-1; y <= max; y++) {
			addPoint(right[y]+1, y);
		}

		function minedge(e, x, y) {
			if (e.min > y) e.min = y;
			var ey = e[y];
			if (ey == null || ey > x) {
				e[y] = x;
			}
		}

		function maxedge(e, x, y) {
			if (e.min > y) e.min = y;
			var ey = e[y];
			if (ey == null || ey < x) {
				e[y] = x;
			}
		}
	}

	// Returns 1 if clockwise, -1 if ccw.
	function polydir(pts) {
		var xp = 0;
		for (var i = 0, l = pts.length, j = l-1; i < l; j = i++) {
			xp += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
		}
		return xp > 0 ? 1 : -1;
	}
}


function FixupOptions(opts) {
	var scale	= opts.scale || 2;
	var scaleX	= +opts.scaleX || scale;
	var scaleY	= +opts.scaleY || scaleX;

	// Fix up padding.
	opts.paddingleft = padding(opts.paddingleft, opts.paddingwidth, opts.padding, scaleX);
	opts.paddingright = padding(opts.paddingright, opts.paddingwidth, opts.padding, scaleX);
	opts.paddingtop = padding(opts.paddingtop, opts.paddingheight, opts.padding, scaleY);
	opts.paddingbottom = padding(opts.paddingbottom, opts.paddingheight, opts.padding, scaleY);

	// We override BWIPP's background color functionality.  If in CMYK, convert to RGB so
	// the drawing interface is consistent.
	if (/^[0-9a-fA-F]{8}$/.test(''+opts.backgroundcolor)) {
		var cmyk = opts.backgroundcolor;
		var c = parseInt(cmyk.substr(0,2), 16) / 255;
		var m = parseInt(cmyk.substr(2,2), 16) / 255;
		var y = parseInt(cmyk.substr(4,2), 16) / 255;
		var k = parseInt(cmyk.substr(6,2), 16) / 255;
		var r = Math.floor((1-c) * (1-k) * 255).toString(16);
		var g = Math.floor((1-m) * (1-k) * 255).toString(16);
		var b = Math.floor((1-y) * (1-k) * 255).toString(16);
		opts.backgroundcolor = (r.length == 1 ? '0' : '') + r +
							   (g.length == 1 ? '0' : '') + g +
							   (b.length == 1 ? '0' : '') + b;
	}

	return opts;

	function padding(a, b, c, s) {
		if (a != null) {
			return a*s;
		}
		if (b != null) {
			return b*s;
		}
		return c*s || 0;
	}
}

var BWIPJS = (function() {

  // Math.floor(), etc. are notoriously slow.  Caching seems to help.
  var floor = Math.floor;
  var round = Math.round;
  var ceil  = Math.ceil;
  var min	  = Math.min;
  var max	  = Math.max;
  
  function BWIPJS(drawing) {
    if (this.constructor !== BWIPJS) {
      return new BWIPJS(drawing);
    }
    this.gstk	 = [];		// Graphics save/restore stack
    this.cmds	 = [];		// Graphics primitives to replay when rendering
    this.drawing = drawing;	// Drawing interface
  
    this.reset();
  
    // Drawing surface bounding box
    this.minx = this.miny = Infinity;
    this.maxx = this.maxy = -Infinity;
  };
  
  // All graphics state that must be saved/restored is given a prefix of g_
  BWIPJS.prototype.reset = function() {
    // Current Transform Matrix - since we don't do rotation, we can fake
    // the matrix math
    this.g_tdx	= 0;		// CTM x-offset
    this.g_tdy	= 0;		// CTM y-offset
    this.g_tsx	= 1;		// CTM x-scale factor
    this.g_tsy	= 1;		// CTM y-scale factor
  
    this.g_posx	= 0;		// current x position
    this.g_posy	= 0;		// current y position
    this.g_penw	= 1;		// current line/pen width
    this.g_path	= [];		// current path
    this.g_font	= null;		// current font object
    this.g_rgb  = [0,0,0];	// current color (black)
  };
  BWIPJS.prototype.save = function() {
    // clone all g_ properties
    var ctx = {};
    for (var id in this) {
      if (id.indexOf('g_') == 0) {
        ctx[id] = clone(this[id]);
      }
    }
    this.gstk.push(ctx);
  
    // Perform a deep clone of the graphics state properties
    function clone(v) {
      if (v instanceof Array) {
        var t = [];
        for (var i = 0; i < v.length; i++)
          t[i] = clone(v[i]);
        return t;
      }
      if (v instanceof Object) {
        var t = {};
        for (var id in v)
          t[id] = clone(v[id]);
        return t;
      }
      return v;
    }
  };
  BWIPJS.prototype.restore = function() {
    if (!this.gstk.length) {
      throw new Error('grestore: stack underflow');
    }
    var ctx = this.gstk.pop();
    for (var id in ctx) {
      this[id] = ctx[id];
    }
  };
  // Per the postscript spec:
  //	As discussed in Section 4.4.1, Current Path, points entered into a path
  //	are immediately converted to device coordinates by the current
  //	transformation matrix (CTM); subsequent modifications to the CTM do not
  //	affect existing points.  `currentpoint` computes the user space
  //	coordinates corresponding to the current point according to the current
  //	value of the CTM. Thus, if a current point is set and then the CTM is
  //	changed, the coordinates returned by currentpoint will be different
  //	from those that were originally specified for the point. 
  BWIPJS.prototype.currpos = function() {
    return { x:(this.g_posx-this.g_tdx)/this.g_tsx,
         y:(this.g_posy-this.g_tdy)/this.g_tsy
      };
  };
  BWIPJS.prototype.currfont = function() {
    return this.g_font;
  };
  BWIPJS.prototype.translate = function(x, y) {
    this.g_tdx = this.g_tsx * x;
    this.g_tdy = this.g_tsy * y;
  };
  BWIPJS.prototype.scale = function(x, y) {
    this.g_tsx *= x;
    this.g_tsy *= y;
    var sxy = this.drawing.scale(this.g_tsx, this.g_tsy);
    if (sxy && sxy[0] && sxy[1]) {
      this.g_tsx = sxy[0];
      this.g_tsy = sxy[1];
    }
  };
  BWIPJS.prototype.setlinewidth = function(w) {
    this.g_penw = w;
  };
  BWIPJS.prototype.selectfont = function(f, z) {
    this.g_font = { FontName:this.jsstring(f), FontSize:+z };
  };
  BWIPJS.prototype.getfont = function() {
    return this.g_font.FontName;
  };
  // Special function for converting a Uint8Array string to string.
  BWIPJS.prototype.jsstring = function(s) {
    if (s instanceof Uint8Array) {
      // Postscript (like C) treats nul-char as end of string.
      for (var i = 0, l = s.length; i < l && s[i]; i++);
      if (i < l) {
        return String.fromCharCode.apply(null,s.subarray(0, i));
      }
      return String.fromCharCode.apply(null,s)
    }
    return ''+s;
  };
  // Special function to replace setanycolor in BWIPP
  // Takes a string of hex digits either 6 chars in length (rrggbb) or
  // 8 chars (ccmmyykk).
  BWIPJS.prototype.setcolor = function(s) {
    if (s instanceof Uint8Array) {
      s = this.jsstring(s);
    }
    if (s.length == 6) {
      var r = parseInt(s.substr(0,2), 16);
      var g = parseInt(s.substr(2,2), 16);
      var b = parseInt(s.substr(4,2), 16);
      this.g_rgb = [ r, g, b ];
    } else if (s.length == 8) {
      var c = parseInt(s.substr(0,2), 16) / 255;
      var m = parseInt(s.substr(2,2), 16) / 255;
      var y = parseInt(s.substr(4,2), 16) / 255;
      var k = parseInt(s.substr(6,2), 16) / 255;
      var r = round((1-c) * (1-k) * 255);
      var g = round((1-m) * (1-k) * 255);
      var b = round((1-y) * (1-k) * 255);
      this.g_rgb = [ r, g, b ];
    }
  };
  // Returns the current rgb values as a 'RRGGBB'
  BWIPJS.prototype.getRGB = function() {
    var r = this.g_rgb[0].toString(16);
    var g = this.g_rgb[1].toString(16);
    var b = this.g_rgb[2].toString(16);
    return '00'.substr(r.length) + r + '00'.substr(g.length) + g + '00'.substr(b.length) + b;
  };
  BWIPJS.prototype.newpath = function() {
    this.g_path = [];
  };
  BWIPJS.prototype.closepath = function() {
    var path = this.g_path;
    var plen = path.length;
    if (!plen) return;
  
    var f = plen-1;
    for ( ; f >= 0 && path[f].op == 'l'; f--);
    f++;
    if (f < plen-1) {
      var poly = [];
      var xmin = Infinity;
      var ymin = Infinity;
      var xmax = -Infinity;
      var ymax = -Infinity;
      for (var i = f; i < plen; i++) {
        var a = path[i];
        poly.push([ a.x0, a.y0 ]);
        if (xmin > a.x0) xmin = a.x0;
        if (xmax < a.x0) xmax = a.x0;
        if (ymin > a.y0) ymin = a.y0;
        if (ymax < a.y0) ymax = a.y0;
      }
      var a = path[plen-1];
      var b = path[f];
      if (a.x1 != b.x0 || a.y1 != b.y0) {
        poly.push([ a.x1, a.y1 ]);
        if (xmin > a.x1) xmin = a.x1;
        if (xmax < a.x1) xmax = a.x1;
        if (ymin > a.y1) ymin = a.y1;
        if (ymax < a.y1) ymax = a.y1;
      }
      path.splice(f, plen-f,
            { op:'p', x0:xmin, y0:ymin, x1:xmax, y1:ymax, poly:poly });
    } else {
      path.push({ op:'c' });
    }
  };
  BWIPJS.prototype.moveto = function(x,y) {
    this.g_posx = this.g_tdx + this.g_tsx * x;
    this.g_posy = this.g_tdy + this.g_tsy * y;
  };
  BWIPJS.prototype.rmoveto = function(x,y) {
    this.g_posx += this.g_tsx * x;
    this.g_posy += this.g_tsy * y;
  };
  BWIPJS.prototype.lineto = function(x,y) {
    var x0 = round(this.g_posx);
    var y0 = round(this.g_posy);
    this.g_posx = this.g_tdx + this.g_tsx * x;
    this.g_posy = this.g_tdy + this.g_tsy * y;
    var x1 = round(this.g_posx);
    var y1 = round(this.g_posy);
  
    this.g_path.push({ op:'l', x0:x0, y0:y0, x1:x1, y1:y1 });
  };
  BWIPJS.prototype.rlineto = function(x,y) {
    var x0 = round(this.g_posx);
    var y0 = round(this.g_posy);
    this.g_posx += this.g_tsx * x;
    this.g_posy += this.g_tsy * y;
    var x1 = round(this.g_posx);
    var y1 = round(this.g_posy);
  
    this.g_path.push({ op:'l', x0:x0, y0:y0, x1:x1, y1:y1 });
  };
  // implements both arc and arcn
  BWIPJS.prototype.arc = function(x,y,r,sa,ea,ccw) {
    if (sa == ea) {
      return;
    }
    // For now, we only implement full circles...
    if (sa != 0 && sa != 360 || ea != 0 && ea != 360) {
      throw new Error('arc: not a full circle (' + sa + ',' + ea + ')');
    }
  
    x = this.g_tdx + this.g_tsx * x;
    y = this.g_tdy + this.g_tsy * y;
  
    // e == ellipse
    var rx = r * this.g_tsx;
    var ry = r * this.g_tsy;
    this.g_path.push({ op:'e', x0:x-rx, y0:y-ry, x1:x+rx, y1:y+ry,
                  x:x, y:y, rx:rx, ry:ry, sa:sa, ea:ea, ccw:ccw });
  };
  BWIPJS.prototype.stringwidth = function(str) {
    var tsx  = this.g_tsx;
    var tsy  = this.g_tsy;
    var size = +this.g_font.FontSize || 10;
  
    // The string can be either a uint8-string or regular string
    str = this.jsstring(str);
  
    var bbox = this.drawing.measure(str, this.g_font.FontName, size*tsx, size*tsy);
  
    return { w:bbox.width/tsx, h:(bbox.ascent+bbox.descent)/tsy,
         a:bbox.ascent/tsy, d:bbox.descent/tsy };
  };
  BWIPJS.prototype.charpath = function(str, b) {
    var sw = this.stringwidth(str);
  
    // Emulate the char-path by placing a rectangle around it
    this.rlineto(0, sw.a);
    this.rlineto(sw.w, 0);
    this.rlineto(0, -sw.h);
  };
  BWIPJS.prototype.pathbbox = function() {
    if (!this.g_path.length)	throw new Error('pathbbox: --nocurrentpoint--');
    var path = this.g_path;
    var llx = Infinity;
    var lly = Infinity;
    var urx = -Infinity;
    var ury = -Infinity;
    for (var i = 0; i < path.length; i++) {
      var a = path[i];
      if (a.op == 'c') {
        continue;
      }
      if (a.x0 < a.x1) {
        if (llx > a.x0) llx = a.x0;
        if (urx < a.x1) urx = a.x1;
      } else {
        if (llx > a.x1) llx = a.x1;
        if (urx < a.x0) urx = a.x0;
      }
      if (a.y0 < a.y1) {
        if (lly > a.y0) lly = a.y0;
        if (ury < a.y1) ury = a.y1;
      } else {
        if (lly > a.y1) lly = a.y1;
        if (ury < a.y0) ury = a.y0;
      }
    }
  
    // Convert to user-space coordinates
    var rv = {	llx:(llx-this.g_tdx)/this.g_tsx,
          lly:(lly-this.g_tdy)/this.g_tsy,
          urx:(urx-this.g_tdx)/this.g_tsx,
          ury:(ury-this.g_tdy)/this.g_tsy };
    return rv;
  };
  // Tranforms the pts array to standard (not y-inverted), unscalled values.
  BWIPJS.prototype.transform = function(pts) {
    var minx = this.minx;
    var maxy = this.maxy;
  
    for (var i = 0; i < pts.length; i++) {
      var pt = pts[i];
      pt[0] = pt[0] - minx;
      pt[1] = maxy - pt[1];
    }
  };
  BWIPJS.prototype.stroke = function() {
    var tsx  = this.g_tsx;
    var tsy  = this.g_tsy;
    var path = this.g_path;
    var rgb  = this.getRGB();
    this.g_path = [];
  
    // This is a "super majority" round i.e. if over .66 round up.
    var penw = floor(this.g_penw * tsx + 0.66);
    var penh = floor(this.g_penw * tsy + 0.66);
  
    // Calculate the bounding boxes
    var nlines = 0, npolys = 0;
    for (var i = 0; i < path.length; i++) {
      var a = path[i];
      if (a.op == 'l') {
        // We only stroke vertical and horizontal lines.  Complex shapes are
        // always filled.
        if (a.x0 != a.x1 && a.y0 != a.y1) {
          throw new Error('stroke: --not-orthogonal--');
        }
        var x0 = a.x0;
        var y0 = a.y0;
        var x1 = a.x1;
        var y1 = a.y1;
  
        // Half widths (may be factional)
        var penw2 = penw/2;
        var penh2 = penh/2;
  
        if (x0 > x1) { var t = x0; x0 = x1; x1 = t; }
        if (y0 > y1) { var t = y0; y0 = y1; y1 = t; }
        if (x0 == x1) {
          this.bbox(x0-penw2, y0, x0+penw-penw2-1, y1); 	// vertical line
        } else {
          this.bbox(x0, y0-penh+penh2+1, x1, y1+penh2);	// horizontal line
        }
        nlines++;
      } else if (a.op == 'p') {
        // Closed (rectangular) poly (border around the barcode)
        var minx = Infinity;
        var miny = Infinity;
        var maxx = -Infinity;
        var maxy = -Infinity;
        var pts  = a.poly;
        if (pts.length != 4) {
          throw new Error('stroke: --not-a-rect--');
        }
        for (var i = 0, j = pts.length-1; i < pts.length; j = i++) {
          var xj = pts[j][0];
          var yj = pts[j][1];
          var xi = pts[i][0];
          var yi = pts[i][1];
  
          if (xi != xj && yi != yj) {
            throw new Error('stroke: --not-orthogonal--');
          }
  
          if (xi < minx) minx = xi;
          if (xi > maxx) maxx = xi;
          if (yi < miny) miny = yi;
          if (yi > maxy) maxy = yi;
        }
  
        // Half widths (integer)
        var penw2 = ceil(penw/2);
        var penh2 = ceil(penh/2);
  
        // We render these as two polygons plus a fill.
        // When border width is odd, allocate the bigger half to the outside.
        this.bbox(minx-penw2, miny-penh2, maxx+penw2, maxy+penh2);
        npolys++;
      } else {
        throw new Error('stroke: --not-a-line--');
      }
    }
  
    // Draw the lines
    var self = this;
    this.cmds.push(function() {
      // Half widths (big half and remaining half)
      var bigw2 = ceil(penw/2);
      var bigh2 = ceil(penh/2);
      var remw2 = penw - bigw2;
      var remh2 = penh - bigh2;
  
      for (var i = 0; i < path.length; i++) {
        var a = path[i]
        if (a.op == 'l') {
          var pts = [ [ a.x0, a.y0 ], [ a.x1, a.y1 ] ];
          self.transform(pts);
          self.drawing.line(pts[0][0], pts[0][1], pts[1][0], pts[1][1],
                a.x0 == a.x1 ? penw : penh, rgb);
          self.fill(rgb);
        } else {
          var pts = a.poly;
          self.transform(pts);
          var x0 = min(pts[0][0], pts[2][0]);
          var x1 = max(pts[0][0], pts[2][0]);
          var y0 = min(pts[0][1], pts[2][1]);
          var y1 = max(pts[0][1], pts[2][1]);
  
          // Top and left edges are "inside" the polygon.
          // Bottom and right edges are outside.
          self.drawing.polygon([
              [ x0-bigw2, y0-bigh2 ],
              [ x0-bigw2, y1+bigh2+1 ],
              [ x1+bigw2+1, y1+bigh2+1 ],
              [ x1+bigw2+1, y0-bigh2 ]
            ]);
          self.drawing.polygon([
              [ x0+remw2, y0+remh2 ],
              [ x0+remw2, y1-remh2+1 ],
              [ x1-remw2+1, y1-remh2+1 ],
              [ x1-remw2+1, y0+remh2 ],
            ]);
          self.drawing.fill(rgb);
        }
      }
    });
  };
  BWIPJS.prototype.fill = function() {
    var path = this.g_path;
    var rgb  = this.getRGB();
    this.g_path = [];
  
    // Calculate the bounding boxes
    for (var p = 0; p < path.length; p++) {
      var a = path[p];
      if (a.op == 'p') {  // polygon
        var minx = Infinity;
        var miny = Infinity;
        var maxx = -Infinity;
        var maxy = -Infinity;
        var pts  = a.poly;
        for (var i = 0; i < pts.length; i++) {
          var xi = pts[i][0];
          var yi = pts[i][1];
  
          if (xi < minx) minx = xi;
          if (xi > maxx) maxx = xi;
          if (yi < miny) miny = yi;
          if (yi > maxy) maxy = yi;
        }
        // With polygons, the right and bottom edges are "outside" and do not
        // contribute to the bounding box.  But we are in postscript inverted-y
        // mode.
        this.bbox(minx, miny+1, maxx-1, maxy);
      } else if (a.op == 'e') {	// ellipse
        this.bbox(a.x - a.rx, a.y - a.ry, a.x + a.rx, a.y + a.ry);
      } else {
        throw new Error('fill: --not-a-polygon--');
      }
    }
  
    // Render the poly
    var self = this;
    this.cmds.push(function() {
      for (var i = 0; i < path.length; i++) {
        var a = path[i];
        if (a.op == 'p') {
          var pts = a.poly
          self.transform(pts);
          self.drawing.polygon(pts);
        } else if (a.op == 'e') {
          var pts = [ [ a.x, a.y ] ];
          self.transform(pts);
          self.drawing.ellipse(pts[0][0], pts[0][1], a.rx, a.ry, a.ccw);
        }
      }
      self.drawing.fill(rgb);
    });
  };
  
  // The pix array is in standard (not y-inverted postscript) orientation.
  BWIPJS.prototype.maxicode = function(pix) {
    var tsx = this.g_tsx;
    var tsy = this.g_tsy;
    var rgb = this.getRGB();
  
    // Module width.  Module height is an integer multiple of tsy.
    var twidth = 1.04 * tsx * 100;
    var mwidth = (twidth / 30)|0;
    if (twidth - (mwidth*30-1) > 9) {
      mwidth++;
    }
  
    // Dimensions needed for plotting the hexagons.  These must be integer values.
    var w, h, wgap, hgap;
    // if (opts.??? ) {
    //	// Create a one or two pixel gap
    //	wgap = (mwidth & 1) ? 1 : 2;
    //	hgap = 1;
    //	w = mwidth - gap;
    //	h = 4 * tsy;
    // } else {
      // Create a 1/8mm gap
      wgap = (tsx/2)|0;
      hgap = (tsy/2)|0;
      w = mwidth - wgap;
      if (w & 1) {
        w--;
      }
      h = ((4*tsy)|0) - hgap;
    //}
  
    // These must be integer values
    var w2 = w / 2 - 1;			// half width
    var qh = ((w2+1) / 2)|0;	// quarter height
    var vh = h - 2 - 2 * qh;	// side height
  
    // Bounding box
    this.bbox(0, 0, mwidth*30 - wgap, tsy * 3 * 32 + tsy * 4 - hgap);
  
    // Render the elements
    var self = this;
    this.cmds.push(function() {
      // Draw the hexagons
      for (var i = 0; i < pix.length; i++) {
        var c = pix[i];
        var x = c % 30;
        var y = (c / 30)|0;
  
        // Adjust x,y to the top of hexagon
        x *= mwidth;
        x += (y & 1) ? mwidth : mwidth/2;
        x = x|0;
  
        y = 33 - y;	// invert for postscript notation
        y *= tsy * 3;
        y += tsy * 2 - h/2;
        y = y|0;
        
        // Build bottom up so the drawing is top-down.
        var pts = [ [ x-0.5, y-- ] ]; 
        y -= qh-1;
        pts.push([x-1-w2, y--]);
        y -= vh;
        pts.push([x-1-w2, y--]);
        y -= qh-1;
        pts.push([x-0.5, y++]);
        y += qh-1;
        pts.push([x+w2, y++]);
        y += vh;
        pts.push([x+w2, y++]);
  
        self.transform(pts);
        self.drawing.hexagon(pts, rgb);
      }
      self.drawing.fill(rgb);
  
  
      // Draw the rings
      var x = (14 * mwidth + mwidth/2 + 0.01)|0;
      var y = ((12 * 4 + 3) * tsy - qh/2 + 0.01)|0;
      self.drawing.ellipse(x, y, (0.5774*3.5*tsx+0.01)|0, (0.5774*3.5*tsy+0.01)|0, true);
      self.drawing.ellipse(x, y, (1.3359*3.5*tsx+0.01)|0, (1.3359*3.5*tsy+0.01)|0, false);
      self.drawing.fill(rgb);
      self.drawing.ellipse(x, y, (2.1058*3.5*tsx+0.01)|0, (2.1058*3.5*tsy+0.01)|0, true);
      self.drawing.ellipse(x, y, (2.8644*3.5*tsx+0.01)|0, (2.8644*3.5*tsy+0.01)|0, false);
      self.drawing.fill(rgb);
      self.drawing.ellipse(x, y, (3.6229*3.5*tsx+0.01)|0, (3.6229*3.5*tsy+0.01)|0, true);
      self.drawing.ellipse(x, y, (4.3814*3.5*tsx+0.01)|0, (4.3814*3.5*tsy+0.01)|0, false);
      self.drawing.fill(rgb);
  
    });
  };
  
  // dx,dy are inter-character gaps
  BWIPJS.prototype.show = function(str, dx, dy) {
    if (!str.length) {
      return;
    }
  
    // Capture current graphics state
    var tsx	 = this.g_tsx;
    var tsy  = this.g_tsy;
    var name = this.g_font.FontName || 'OCR-B';
    var size = (this.g_font.FontSize || 10);
    var szx  = size * tsx;
    var szy  = size * tsy;
    var posx = this.g_posx;
    var posy = this.g_posy;
    var rgb  = this.getRGB();
  
    // The string can be either a uint8-string or regular string
    str = this.jsstring(str);
  
    // Convert dx,dy to device space
    dx = tsx * dx || 0;
    dy = tsy * dy || 0;
  
    // Bounding box.
    var base = posy + dy;
    var bbox = this.drawing.measure(str, name, szx, szy);
    var width = bbox.width + (str.length-1) * dx;
    this.bbox(posx, base-bbox.descent+1, posx+width-1, base+bbox.ascent);
    this.g_posx += width;
  
    var self = this;
    self.cmds.push(function() {
      // self.transform()
      var x = posx - self.minx;
      var y = self.maxy - posy;
      self.drawing.text(x, y, str, rgb, { name:name, width:szx, height:szy, dx:dx });
    });
  };
  // drawing surface bounding box
  BWIPJS.prototype.bbox = function(x0, y0, x1, y1) {
    if (x0 > x1) { var t = x0; x0 = x1; x1 = t; }
    if (y0 > y1) { var t = y0; y0 = y1; y1 = t; }
  
    x0 = floor(x0);
    y0 = floor(y0);
    x1 = ceil(x1);
    y1 = ceil(y1);
  
    if (this.minx > x0) this.minx = x0;
      if (this.maxx < x1)	this.maxx = x1;
      if (this.miny > y0)	this.miny = y0;
    if (this.maxy < y1)	this.maxy = y1;
  };
  BWIPJS.prototype.render = function() {
    if (this.minx === Infinity) {
          // Most likely, `dontdraw` was set in the options
          return new Promise(function (resolve, reject) {
              resolve(null);
          });
    }
    // Draw the image
    this.drawing.init(this.maxx - this.minx + 1, this.maxy - this.miny + 1,
              this.g_tsx, this.g_tsy);
    for (var i = 0, l = this.cmds.length; i < l; i++) {
      this.cmds[i]();
    }
    return this.drawing.end();
  };
  
  return BWIPJS;
  })();	

  var BWIPJS_OPTIONS = {
    bcid:1,
    text:1,
    scale:1,
    scaleX:1,
    scaleY:1,
    rotate:1,
    padding:1,
    paddingwidth:1,
    paddingheight:1,
    paddingtop:1,
    paddingleft:1,
    paddingright:1,
    paddingbottom:1,
    backgroundcolor:1,
  };

  function bwipp_pharmacode2() {
    var $1 = {}; //#8828
    $1.options = $k[--$j]; //#8830
    $1.barcode = $k[--$j]; //#8831
    $1.dontdraw = false; //#8833
    $1.includetext = false; //#8834
    $1.height = 4; //#8835
    $forall($1.options, function() { //#8846
        var _3 = $k[--$j]; //#8846
        $1[$k[--$j]] = _3; //#8846
    }); //#8846
    $1.height = +$1.height; //#8848
    if (($1.barcode.length < 1) || ($1.barcode.length > 8)) { //#8853
        $k[$j++] = 'bwipp.pharmacode2BadLength'; //#8852
        $k[$j++] = "Two-track Pharmacode must be 1 to 6 digits"; //#8852
        bwipp_raiseerror(); //#8852
    } //#8852
    $forall($1.barcode, function() { //#8858
        var _9 = $k[--$j]; //#8855
        if ((_9 < 48) || (_9 > 57)) { //#8857
            $k[$j++] = 'bwipp.pharmacode2badCharacter'; //#8856
            $k[$j++] = "Two-track Pharmacode must contain only digits"; //#8856
            bwipp_raiseerror(); //#8856
        } //#8856
    }); //#8856
    var _B = ~~$z($1.barcode); //#8859
    if ((_B < 4) || (_B > 64570080)) { //#8861
        $k[$j++] = 'bwipp.pharmacode2badValue'; //#8860
        $k[$j++] = "Two-track Pharmacode value must be between 4 and 64570080"; //#8860
        bwipp_raiseerror(); //#8860
    } //#8860
    $1.txt = $a($1.barcode.length); //#8864
    for (var _G = 0, _F = $1.barcode.length - 1; _G <= _F; _G += 1) { //#8868
        $1.i = _G; //#8866
        $put($1.txt, $1.i, $a([$geti($1.barcode, $1.i, 1), 0, 0, "", 0])); //#8867
    } //#8867
    $1.encstr = $s(16); //#8870
    $1.sbs = $a(32); //#8871
    $1.bar = (1 / 25.4) * $1.height; //#8872
    $1.spc = (1 / 25.4) * 72; //#8873
    $1.i = 15; //#8876
    $1.val = ~~$z($1.barcode); //#8877
    for (;;) { //#8884
        if ($1.val == 0) { //#8879
            break; //#8879
        } //#8879
        var _T = $1.val % 3; //#8880
        $1.val = ~~($f($1.val - $get($a([3, 1, 2]), _T)) / 3); //#8881
        $put($1.encstr, $1.i, $get($a([2, 0, 1]), _T)); //#8882
        $1.i = $1.i - 1; //#8883
    } //#8883
    $1.encstr = $geti($1.encstr, $1.i + 1, 15 - $1.i); //#8885
    $1.bhs = $a($1.encstr.length); //#8888
    $1.bbs = $a($1.encstr.length); //#8889
    for (var _m = 0, _l = $1.encstr.length - 1; _m <= _l; _m += 1) { //#8895
        $1.i = _m; //#8891
        var _p = $get($1.encstr, $1.i); //#8892
        $put($1.bhs, $1.i, $1.bar * $get($a([1, 1, 2]), _p)); //#8893
        $put($1.bbs, $1.i, $get($a([0, $1.bar, 0]), _p)); //#8894
    } //#8894
    $k[$j++] = Infinity; //#8906
    var _10 = $1.bhs; //#8900
    var _11 = $1.bbs; //#8901
    $k[$j++] = Infinity; //#8902
    for (var _13 = 0, _14 = $1.encstr.length * 2; _13 < _14; _13++) { //#8902
        $k[$j++] = $1.spc; //#8902
    } //#8902
    var _16 = $a(); //#8902
    $k[$j++] = 'ren'; //#8906
    $k[$j++] = bwipp_renlinear; //#8906
    $k[$j++] = 'bhs'; //#8906
    $k[$j++] = _10; //#8906
    $k[$j++] = 'bbs'; //#8906
    $k[$j++] = _11; //#8906
    $k[$j++] = 'sbs'; //#8906
    $k[$j++] = _16; //#8906
    $k[$j++] = 'txt'; //#8906
    $k[$j++] = $1.txt; //#8906
    $k[$j++] = 'textxalign'; //#8906
    $k[$j++] = "center"; //#8906
    $k[$j++] = 'textyoffset'; //#8906
    $k[$j++] = 4; //#8906
    $k[$j++] = 'opt'; //#8906
    $k[$j++] = $1.options; //#8906
    var _19 = $d(); //#8906
    $k[$j++] = _19; //#8909
    if (!$1.dontdraw) { //#8909
        bwipp_renlinear(); //#8909
    } //#8909
}

function bwipp_encode(bwipjs, encoder, text, opts, dontdraw) {
  if (typeof text !== 'string') {
      throw new Error('bwipp.typeError: barcode text not a string (' +
          text + ')');
  }
  opts = opts || {};
  if (typeof opts === 'string') {
      var tmp = opts.split(' ');
      opts = {};
      for (var i = 0; i < tmp.length; i++) {
          if (!tmp[i]) {
              continue;
          }
          var eq = tmp[i].indexOf('=');
          if (eq == -1) {
              opts[tmp[i]] = true;
          } else {
              opts[tmp[i].substr(0, eq)] = tmp[i].substr(eq + 1);
          }
      }
  } else if (typeof opts !== 'object' || opts.constructor !== Object) {
      throw new Error('bwipp.typeError: options not an object');
  }

  // Convert utf-16 to utf-8 but leave binary (8-bit) strings untouched.
  if (/[\u0100-\uffff]/.test(text)) {
      text = unescape(encodeURIComponent(text));
  }

  // Don't draw? (See file runtest)
  $0.bwipjs_dontdraw = opts.dontdraw || dontdraw || false;

  // Convert opts to a Map
  var map = new Map;
  for (var id in opts) {
      if (opts.hasOwnProperty(id)) {
          map.set(id, opts[id]);
      }
  }

  // Invoke the encoder
  $$ = bwipjs;
  $k = [text, map];
  $j = 2;
  encoder();

  // Return what is left on the stack.  This branch should only be taken
  // when running with the dontdraw option.
  if ($j) {
      return $k.splice(0, $j);
  }

  return true;
}

var $f = (function(fa) {
  return function(v) {
      return Number.isInteger(v) ? v : (fa[0] = v, fa[0]);
  };
})(new Float32Array(1));


function $aload(a) {
  for (var i = 0, l = a.length, b = a.b, o = a.o; i < l; i++) {
      $k[$j++] = b[o + i];
  }
  // This push has been optimized out.  See $.aload() in psc.js.
  //$k[$j++] = a;
}

function $put(d, k, v) {
  if (d instanceof Uint8Array) {
      d[k] = v;
  } else if (d instanceof Array) {
      d.b[d.o + k] = v;
  } else if (typeof d == 'object') {
      if (k instanceof Uint8Array) {
          d.set($z(k), v);
      } else {
          d.set(k, v);
      }
  } else {
      throw 'put-not-writable-' + (typeof d);
  }
}

function bwipp_parseinput() {
  var $1 = {}; //#80
  $1.fncvals = $k[--$j]; //#82
  $1.barcode = $k[--$j]; //#83
  var _2 = 'parse'; //#85
  $1[_2] = $get($1.fncvals, _2); //#85
  delete $1.fncvals[_2]; //#85
  var _6 = 'parsefnc'; //#86
  $1[_6] = $get($1.fncvals, _6); //#86
  delete $1.fncvals[_6]; //#86
  var _A = 'parseonly'; //#87
  var _C = $get($1.fncvals, _A) !== undefined; //#87
  $1[_A] = _C; //#87
  delete $1.fncvals[_A]; //#87
  var _E = 'eci'; //#88
  var _G = $get($1.fncvals, _E) !== undefined; //#88
  $1[_E] = _G; //#88
  delete $1.fncvals[_E]; //#88
  $1.msg = $a($1.barcode.length); //#90
  $1.j = 0; //#91
  $k[$j++] = $1.barcode; //#186
  for (;;) { //#186
      $search($k[--$j], "^"); //#93
      var _M = $k[--$j]; //#93
      var _N = $k[--$j]; //#93
      $k[$j++] = _M; //#96
      $k[$j++] = _N.length; //#96
      $k[$j++] = $1.msg; //#96
      $k[$j++] = $1.j; //#96
      $k[$j++] = _N; //#96
      $k[$j++] = Infinity; //#96
      var _Q = $k[--$j]; //#96
      var _R = $k[--$j]; //#96
      $k[$j++] = _Q; //#96
      $forall(_R); //#96
      var _S = $a(); //#96
      var _T = $k[--$j]; //#96
      $puti($k[--$j], _T, _S); //#96
      $1.j = $f($k[--$j] + $1.j); //#97
      if ($k[--$j]) { //#184
          $j--; //#99
          for (var _Y = 0, _Z = 1; _Y < _Z; _Y++) { //#182
              if ($an($nt($1.parse), $nt($1.parsefnc))) { //#106
                  $put($1.msg, $1.j, 94); //#103
                  $1.j = $f($1.j + 1); //#104
                  break; //#105
              } //#105
              $put($1.msg, $1.j, 94); //#109
              $1.j = $f($1.j + 1); //#110
              if ($1.parse) { //#129
                  var _j = $k[--$j]; //#114
                  $k[$j++] = _j; //#128
                  if (_j.length >= 3) { //#128
                      var _k = $k[--$j]; //#115
                      var _l = $geti(_k, 0, 3); //#115
                      $k[$j++] = _k; //#117
                      $k[$j++] = true; //#117
                      for (var _m = 0, _n = _l.length; _m < _n; _m++) { //#117
                          var _o = $get(_l, _m); //#117
                          if ((_o < 48) || (_o > 57)) { //#116
                              $j--; //#116
                              $k[$j++] = false; //#116
                          } //#116
                      } //#116
                      if ($k[--$j]) { //#127
                          var _q = $k[--$j]; //#119
                          var _r = $geti(_q, 0, 3); //#119
                          var _s = ~~$z(_r); //#119
                          $k[$j++] = _q; //#122
                          $k[$j++] = _s; //#122
                          if (_s > 255) { //#122
                              $j -= 2; //#120
                              $k[$j++] = 'bwipp.invalidOrdinal'; //#121
                              $k[$j++] = "Ordinal must be 000 to 255"; //#121
                              bwipp_raiseerror(); //#121
                          } //#121
                          $1.j = $f($1.j - 1); //#123
                          $put($1.msg, $1.j, $k[--$j]); //#124
                          $1.j = $f($1.j + 1); //#125
                          var _y = $k[--$j]; //#126
                          $k[$j++] = $geti(_y, 3, _y.length - 3); //#126
                      } //#126
                  } //#126
              } //#126
              if (($or($1.parseonly, $nt($1.parsefnc))) || ($get($1.msg, $f($1.j - 1)) != 94)) { //#134
                  break; //#134
              } //#134
              $1.j = $f($1.j - 1); //#137
              var _16 = $k[--$j]; //#138
              $k[$j++] = _16; //#141
              if (_16.length < 3) { //#141
                  $j--; //#139
                  $k[$j++] = 'bwipp.truncatedFNC'; //#140
                  $k[$j++] = "Function character truncated"; //#140
                  bwipp_raiseerror(); //#140
              } //#140
              var _17 = $k[--$j]; //#142
              $k[$j++] = _17; //#147
              if ($get(_17, 0) == 94) { //#147
                  $put($1.msg, $1.j, 94); //#143
                  $1.j = $f($1.j + 1); //#144
                  var _1C = $k[--$j]; //#145
                  $k[$j++] = $geti(_1C, 1, _1C.length - 1); //#146
                  break; //#146
              } //#146
              var _1E = $k[--$j]; //#148
              $k[$j++] = _1E; //#165
              if ($eq($geti(_1E, 0, 3), "ECI") && $1.eci) { //#165
                  var _1H = $k[--$j]; //#149
                  $k[$j++] = _1H; //#152
                  if (_1H.length < 9) { //#152
                      $j--; //#150
                      $k[$j++] = 'bwipp.truncatedECI'; //#151
                      $k[$j++] = "ECI truncated"; //#151
                      bwipp_raiseerror(); //#151
                  } //#151
                  var _1I = $k[--$j]; //#153
                  var _1J = $geti(_1I, 3, 6); //#153
                  $k[$j++] = _1I; //#159
                  $k[$j++] = _1J; //#159
                  for (var _1K = 0, _1L = _1J.length; _1K < _1L; _1K++) { //#159
                      var _1M = $get(_1J, _1K); //#159
                      if ((_1M < 48) || (_1M > 57)) { //#158
                          $j -= 2; //#156
                          $k[$j++] = 'bwipp.invalidECI'; //#157
                          $k[$j++] = "ECI must be 000000 to 999999"; //#157
                          bwipp_raiseerror(); //#157
                      } //#157
                  } //#157
                  var _1N = $k[--$j]; //#160
                  $k[$j++] = 0; //#160
                  $forall(_1N, function() { //#160
                      var _1O = $k[--$j]; //#160
                      var _1P = $k[--$j]; //#160
                      $k[$j++] = ($f(_1P - $f(_1O - 48))) * 10; //#160
                  }); //#160
                  $put($1.msg, $1.j, (~~($k[--$j] / 10)) - 1000000); //#161
                  $1.j = $f($1.j + 1); //#162
                  var _1U = $k[--$j]; //#163
                  $k[$j++] = $geti(_1U, 9, _1U.length - 9); //#164
                  break; //#164
              } //#164
              var _1W = $k[--$j]; //#166
              $k[$j++] = _1W; //#169
              if (_1W.length < 4) { //#169
                  $j--; //#167
                  $k[$j++] = 'bwipp.truncatedFNC'; //#168
                  $k[$j++] = "Function character truncated"; //#168
                  bwipp_raiseerror(); //#168
              } //#168
              var _1X = $k[--$j]; //#170
              var _1Y = $geti(_1X, 0, 4); //#170
              var _1a = $get($1.fncvals, _1Y) !== undefined; //#170
              $k[$j++] = _1X; //#175
              $k[$j++] = _1Y; //#175
              if (!_1a) { //#175
                  var _1b = $k[--$j]; //#171
                  var _1c = $s(_1b.length + 28); //#171
                  $puti(_1c, 28, _1b); //#171
                  $puti(_1c, 0, "Unknown function character: "); //#172
                  var _1d = $k[--$j]; //#173
                  $k[$j++] = _1c; //#173
                  $k[$j++] = _1d; //#173
                  $j--; //#173
                  var _1e = $k[--$j]; //#174
                  $k[$j++] = 'bwipp.unknownFNC'; //#174
                  $k[$j++] = _1e; //#174
                  bwipp_raiseerror(); //#174
              } //#174
              $put($1.msg, $1.j, $get($1.fncvals, $k[--$j])); //#177
              $1.j = $f($1.j + 1); //#178
              var _1l = $k[--$j]; //#179
              $k[$j++] = $geti(_1l, 4, _1l.length - 4); //#180
              break; //#180
          } //#180
      } else { //#184
          break; //#184
      } //#184
  } //#184
  if ($nt($1.parseonly)) { //#192
      $k[$j++] = $geti($1.msg, 0, $1.j); //#189
  } else { //#192
      $k[$j++] = $s($1.j); //#192
      for (var _1v = 0, _1u = $f($1.j - 1); _1v <= _1u; _1v += 1) { //#192
          var _1w = $k[--$j]; //#192
          $put(_1w, _1v, $get($1.msg, _1v)); //#192
          $k[$j++] = _1w; //#192
      } //#192
  } //#192
}

function $search(str, seek) {
  if (!(str instanceof Uint8Array)) {
      str = $s(str);
  }
  var ls = str.length;

  // Virtually all uses of search in BWIPP are for single-characters.
  // Optimize for that case.
  if (seek.length == 1) {
      var lk = 1;
      var cd = seek instanceof Uint8Array ? seek[0] : seek.charCodeAt(0);
      for (var i = 0; i < ls && str[i] != cd; i++);
  } else {
      // Slow path, 
      if (!(seek instanceof Uint8Array)) {
          seek = $(seek);
      }
      var lk = seek.length;
      var cd = seek[0];
      for (var i = 0; i < ls && str[i] != cd; i++);
      while (i < ls) {
          for (var j = 1; j < lk && str[i + j] === seek[j]; j++);
          if (j === lk) {
              break;
          }
          for (i++; i < ls && str[i] != cd; i++);
      }
  }
  if (i < ls) {
      $k[$j++] = str.subarray(i + lk);
      $k[$j++] = str.subarray(i, i + lk);
      $k[$j++] = str.subarray(0, i);
      $k[$j++] = true;
  } else {
      $k[$j++] = str;
      $k[$j++] = false;
  }
}

function $s(v) {
  var t = typeof v;
  if (t === 'number') {
      return new Uint8Array(v);
  }
  if (t !== 'string') {
      v = '' + v;
  }
  var s = new Uint8Array(v.length);
  for (var i = 0; i < v.length; i++) {
      s[i] = v.charCodeAt(i);
  }
  return s;
}

function $puti(d, o, s) {
  if (d instanceof Uint8Array) {
      if (typeof s == 'string') {
          for (var i = 0, l = s.length; i < l; i++) {
              d[o + i] = s.charCodeAt(i);
          }
      } else {
          // When both d and s are the same, we want to copy
          // backwards, which works for the general case as well.
          for (var i = s.length - 1; i >= 0; i--) {
              d[o + i] = s[i];
          }
      }
  } else if (d instanceof Array) {
      // Operate on the base arrays
      var darr = d.b;
      var doff = o + d.o;
      var sarr = s.b;
      var soff = s.o;

      for (var i = 0, l = s.length; i < l; i++) {
          darr[doff + i] = sarr[soff + i];
      }
  } else {
      throw 'putinterval-not-writable-' + (typeof d);
  }
}

function $nt(a) {
  return typeof a == 'boolean' ? !a : ~a;
}

function $geti(s, o, l) {
  if (s instanceof Uint8Array) {
      return s.subarray(o, o + l);
  }
  if (s instanceof Array) {
      var a = new Array(l);
      a.b = s.b; // base array
      a.o = s.o + o; // offset into base
      return a;
  }
  // Must be a string
  return s.substr(o, l);
}

function $cvrs(s, n, r) {
  return $strcpy(s, (~~n).toString(r).toUpperCase());
}

function $strcpy(dst, src) {
  if (typeof dst === 'string') {
      dst = $s(dst);
  }
  if (src instanceof Uint8Array) {
      for (var i = 0, l = src.length; i < l; i++) {
          dst[i] = src[i];
      }
  } else {
      for (var i = 0, l = src.length; i < l; i++) {
          dst[i] = src.charCodeAt(i);
      }
  }
  return src.length < dst.length ? dst.subarray(0, src.length) : dst;
}

function $d() {
  // Build the dictionary in the order the keys/values were pushed so enumeration
  // occurs in the correct sequence.
  for (var mark = $j - 1; mark >= 0 && $k[mark] !== Infinity; mark -= 2) {
      if ($k[mark - 1] === Infinity) {
          throw new Error('dict-malformed-stack');
      }
  }
  if (mark < 0) {
      throw 'dict-marker-not-found';
  }
  var d = new Map;
  for (var i = mark + 1; i < $j; i += 2) {
      // Unlike javascript, postscript dict keys differentiate between
      // numbers and the string representation of a number.
      var k = $k[i]; // "key" into the dict entry
      var t = typeof k;
      if (t == 'number' || t == 'string') {
          d.set(k, $k[i + 1]);
      } else if (k instanceof Uint8Array) {
          d.set($z(k), $k[i + 1]);
      } else {
          throw 'dict-not-a-valid-key(' + k + ')';
      }
  }
  $j = mark;
  return d;
}

function $xo(a, b) { // xor
  return (typeof a === 'boolean') ? !a && b || a && !b : a ^ b;
}

function bwipp_renmatrix() {
  if ($0.bwipjs_dontdraw) { //#2145
      return; //#2145
  } //#2145
  var $1 = {}; //#2147
  $1.args = $k[--$j]; //#2149
  $1.width = 1; //#2152
  $1.height = 1; //#2153
  $1.barcolor = "unset"; //#2154
  $1.backgroundcolor = "unset"; //#2155
  $1.colormap = "unset"; //#2156
  $1.dotty = false; //#2157
  $1.inkspread = 0; //#2158
  $1.inkspreadh = 0; //#2159
  $1.inkspreadv = 0; //#2160
  $1.includetext = false; //#2161
  $1.txt = $a([]); //#2162
  $1.textcolor = "unset"; //#2163
  $1.textxalign = "unset"; //#2164
  $1.textyalign = "unset"; //#2165
  $1.textfont = "OCR-B"; //#2166
  $1.textsize = 10; //#2167
  $1.textxoffset = 0; //#2168
  $1.textyoffset = 0; //#2169
  $1.textgaps = 0; //#2170
  $1.alttext = ""; //#2171
  $forall($1.args, function() { //#2174
      var _4 = $k[--$j]; //#2174
      $1[$k[--$j]] = _4; //#2174
  }); //#2174
  var _6 = $1.opt; //#2175
  for (var _B = _6.size, _A = _6.keys(), _9 = 0; _9 < _B; _9++) { //#2175
      var _7 = _A.next().value; //#2175
      $1[_7] = _6.get(_7); //#2175
  } //#2175
  $1.width = +$1.width; //#2177
  $1.height = +$1.height; //#2178
  $1.barcolor = "" + $1.barcolor; //#2179
  $1.backgroundcolor = "" + $1.backgroundcolor; //#2180
  $1.inkspread = +$1.inkspread; //#2181
  $1.inkspreadh = +$1.inkspreadh; //#2182
  $1.inkspreadv = +$1.inkspreadv; //#2183
  $1.textcolor = "" + $1.textcolor; //#2184
  $1.textxalign = "" + $1.textxalign; //#2185
  $1.textyalign = "" + $1.textyalign; //#2186
  $1.textfont = "" + $1.textfont; //#2187
  $1.textsize = +$1.textsize; //#2188
  $1.textxoffset = +$1.textxoffset; //#2189
  $1.textyoffset = +$1.textyoffset; //#2190
  $1.textgaps = +$1.textgaps; //#2191
  $1.alttext = "" + $1.alttext; //#2192
  if ($1.inkspread != 0) { //#2194
      $1.inkspreadh = $1.inkspread; //#2194
  } //#2194
  if ($1.inkspread != 0) { //#2195
      $1.inkspreadv = $1.inkspread; //#2195
  } //#2195
  $1.xyget = function() {
      var _X = $k[--$j]; //#2197
      var _a = $get($1.pixs, $f($k[--$j] + (_X * $1.pixx))); //#2197
      $k[$j++] = _a; //#2197
  }; //#2197
  $1.cget = function() {
      var _c = $k[--$j]; //#2198
      var _f = $get($1.cache, $f($k[--$j] + (_c * $1.pixx))); //#2198
      var _g = $k[--$j]; //#2198
      $k[$j++] = $an(_g, _f); //#2198
  }; //#2198
  $1.cput = function() {
      var _h = $k[--$j]; //#2200
      $k[$j++] = _h; //#2204
      if ((_h % 4) == 0) { //#2203
          var _i = $k[--$j]; //#2201
          var _j = $k[--$j]; //#2201
          var _k = $k[--$j]; //#2201
          var _l = $1.pixx; //#2201
          var _m = $1.cache; //#2201
          $put(_m, $f(_k + (_j * _l)), $or($get(_m, $f(_k + (_j * _l))), _i)); //#2201
      } else { //#2203
          $j -= 3; //#2203
      } //#2203
  }; //#2205
  $1.abcd = function() {
      $k[$j++] = $s(4); //#2212
      $k[$j++] = 0; //#2212
      $k[$j++] = Infinity; //#2212
      var _p = $k[--$j]; //#2209
      var _q = $k[--$j]; //#2209
      var _r = $k[--$j]; //#2209
      var _s = $k[--$j]; //#2209
      var _v = $f($k[--$j] + (_s * $1.pixx)); //#2210
      $k[$j++] = _r; //#2211
      $k[$j++] = _q; //#2211
      $k[$j++] = _p; //#2211
      $k[$j++] = _v; //#2211
      $aload($geti($1.pixs, _v, 2)); //#2211
      var _y = $k[--$j]; //#2211
      var _z = $k[--$j]; //#2211
      var _13 = $geti($1.pixs, $f($k[--$j] + $1.pixx), 2); //#2212
      $k[$j++] = _z; //#2212
      $k[$j++] = _y; //#2212
      $aload(_13); //#2212
      var _14 = $a(); //#2212
      for (var _15 = 0, _16 = _14.length; _15 < _16; _15++) { //#2213
          var _18 = $k[--$j]; //#2213
          var _19 = $k[--$j]; //#2213
          $put(_19, _18, $f($get(_14, _15) + 48)); //#2213
          $k[$j++] = _19; //#2213
          $k[$j++] = $f(_18 + 1); //#2213
      } //#2213
      $j--; //#2213
  }; //#2214
  $1.right = function() {
      if ($1.dir != 1) { //#2216
          $k[$j++] = $1.x; //#2216
          $k[$j++] = $1.y; //#2216
          $k[$j++] = $1.dir; //#2216
          $1.cput(); //#2216
          $k[$j++] = $a([$1.x, $1.y]); //#2216
      } //#2216
      $1.x = $1.x + 1; //#2216
      $1.dir = 1; //#2216
  }; //#2216
  $1.down = function() {
      if ($1.dir != 2) { //#2217
          $k[$j++] = $1.x; //#2217
          $k[$j++] = $1.y; //#2217
          $k[$j++] = $1.dir; //#2217
          $1.cput(); //#2217
          $k[$j++] = $a([$1.x, $1.y]); //#2217
      } //#2217
      $1.y = $1.y + 1; //#2217
      $1.dir = 2; //#2217
  }; //#2217
  $1.left = function() {
      if ($1.dir != 4) { //#2218
          $k[$j++] = $1.x; //#2218
          $k[$j++] = $1.y; //#2218
          $k[$j++] = $1.dir; //#2218
          $1.cput(); //#2218
          $k[$j++] = $a([$1.x, $1.y]); //#2218
      } //#2218
      $1.x = $1.x - 1; //#2218
      $1.dir = 4; //#2218
  }; //#2218
  $1.up = function() {
      if ($1.dir != 8) { //#2219
          $k[$j++] = $1.x; //#2219
          $k[$j++] = $1.y; //#2219
          $k[$j++] = $1.dir; //#2219
          $1.cput(); //#2219
          $k[$j++] = $a([$1.x, $1.y]); //#2219
      } //#2219
      $1.y = $1.y - 1; //#2219
      $1.dir = 8; //#2219
  }; //#2219
  $1.trace = function() {
      $1.y = $k[--$j]; //#2223
      $1.x = $k[--$j]; //#2223
      $k[$j++] = 'dir'; //#2225
      $k[$j++] = $f($1.x + 1); //#2225
      $k[$j++] = $f($1.y + 1); //#2225
      $1.xyget(); //#2225
      var _1l = ($k[--$j] == 1) ? 8 : 4; //#2225
      $1[$k[--$j]] = _1l; //#2225
      $1.sx = $1.x; //#2226
      $1.sy = $1.y; //#2226
      $1.sdir = $1.dir; //#2226
      $k[$j++] = Infinity; //#2230
      for (;;) { //#2244
          $k[$j++] = $1.x; //#2231
          $k[$j++] = $1.y; //#2231
          $1.abcd(); //#2231
          for (var _1s = 0, _1t = 1; _1s < _1t; _1s++) { //#2242
              var _1u = $k[--$j]; //#2233
              $k[$j++] = _1u; //#2233
              if ($eq(_1u, "0001") || ($eq(_1u, "0011") || $eq(_1u, "1011"))) { //#2233
                  $j--; //#2233
                  $1.right(); //#2233
                  break; //#2233
              } //#2233
              var _1v = $k[--$j]; //#2234
              $k[$j++] = _1v; //#2234
              if ($eq(_1v, "0010") || ($eq(_1v, "1010") || $eq(_1v, "1110"))) { //#2234
                  $j--; //#2234
                  $1.down(); //#2234
                  break; //#2234
              } //#2234
              var _1w = $k[--$j]; //#2235
              $k[$j++] = _1w; //#2235
              if ($eq(_1w, "1000") || ($eq(_1w, "1100") || $eq(_1w, "1101"))) { //#2235
                  $j--; //#2235
                  $1.left(); //#2235
                  break; //#2235
              } //#2235
              var _1x = $k[--$j]; //#2236
              $k[$j++] = _1x; //#2236
              if ($eq(_1x, "0100") || ($eq(_1x, "0101") || $eq(_1x, "0111"))) { //#2236
                  $j--; //#2236
                  $1.up(); //#2236
                  break; //#2236
              } //#2236
              var _1y = $k[--$j]; //#2237
              $k[$j++] = _1y; //#2241
              if ($eq(_1y, "1001")) { //#2240
                  if ($1.dir == 2) { //#2238
                      $j--; //#2238
                      $1.left(); //#2238
                      break; //#2238
                  } else { //#2238
                      $j--; //#2238
                      $1.right(); //#2238
                      break; //#2238
                  } //#2238
              } else { //#2240
                  if ($1.dir == 1) { //#2240
                      $j--; //#2240
                      $1.down(); //#2240
                      break; //#2240
                  } else { //#2240
                      $j--; //#2240
                      $1.up(); //#2240
                      break; //#2240
                  } //#2240
              } //#2240
          } //#2240
          if (($eq($1.x, $1.sx) && $eq($1.y, $1.sy)) && ($1.dir == $1.sdir)) { //#2243
              break; //#2243
          } //#2243
      } //#2243
      $astore($a($counttomark())); //#2245
      var _29 = $k[--$j]; //#2245
      var _2A = $k[--$j]; //#2245
      $k[$j++] = _29; //#2245
      $k[$j++] = _2A; //#2245
      $j--; //#2245
  }; //#2247
  $1.drawlayer = function() {
      $1.pixsorig = $1.pixs; //#2263
      $1.pixs = $k[--$j]; //#2264
      $k[$j++] = Infinity; //#2274
      for (var _2E = 0, _2F = $1.pixx + 2; _2E < _2F; _2E++) { //#2268
          $k[$j++] = 0; //#2268
      } //#2268
      for (var _2J = 0, _2K = $1.pixx, _2I = $1.pixs.length - 1; _2K < 0 ? _2J >= _2I : _2J <= _2I; _2J += _2K) { //#2273
          $k[$j++] = 0; //#2271
          $aload($geti($1.pixs, _2J, $1.pixx)); //#2271
          $k[$j++] = 0; //#2272
      } //#2272
      for (var _2P = 0, _2Q = $1.pixx + 2; _2P < _2Q; _2P++) { //#2274
          $k[$j++] = 0; //#2274
      } //#2274
      $1.pixs = $a(); //#2274
      $1.pixx = $1.pixx + 2; //#2276
      $1.pixy = $1.pixy + 2; //#2277
      $k[$j++] = Infinity; //#2280
      for (var _2V = 0, _2W = $1.pixs.length; _2V < _2W; _2V++) { //#2280
          $k[$j++] = 0; //#2280
      } //#2280
      $1.cache = $a(); //#2280
      $k[$j++] = Infinity; //#2296
      for (var _2a = 0, _2Z = $1.pixy - 2; _2a <= _2Z; _2a += 1) { //#2300
          $1.j = _2a; //#2285
          for (var _2d = 0, _2c = $1.pixx - 2; _2d <= _2c; _2d += 1) { //#2299
              $1.i = _2d; //#2287
              $k[$j++] = 'k'; //#2288
              $k[$j++] = $1.i; //#2288
              $k[$j++] = $1.j; //#2288
              $1.abcd(); //#2288
              var _2g = $k[--$j]; //#2288
              $1[$k[--$j]] = _2g; //#2288
              if ($eq($1.k, "0001") || $eq($1.k, "1001")) { //#2293
                  $k[$j++] = 8; //#2290
                  $k[$j++] = $1.i; //#2290
                  $k[$j++] = $1.j; //#2290
                  $1.cget(); //#2290
                  if ($k[--$j] == 0) { //#2292
                      $k[$j++] = $1.i; //#2291
                      $k[$j++] = $1.j; //#2291
                      $1.trace(); //#2291
                  } //#2291
              } //#2291
              if ($eq($1.k, "1110")) { //#2298
                  $k[$j++] = 4; //#2295
                  $k[$j++] = $1.i; //#2295
                  $k[$j++] = $1.j; //#2295
                  $1.cget(); //#2295
                  if ($k[--$j] == 0) { //#2297
                      $k[$j++] = $1.i; //#2296
                      $k[$j++] = $1.j; //#2296
                      $1.trace(); //#2296
                  } //#2296
              } //#2296
          } //#2296
      } //#2296
      $1.paths = $a(); //#2296
      $1.pixx = $1.pixx - 2; //#2304
      $1.pixy = $1.pixy - 2; //#2305
      $$.newpath(); //#2308
      var _2y = $1.paths; //#2309
      for (var _2z = 0, _30 = _2y.length; _2z < _30; _2z++) { //#2327
          $1.p = $get(_2y, _2z); //#2310
          $1.len = $1.p.length; //#2311
          $aload($get($1.p, $1.len - 1)); //#2312
          $aload($get($1.p, 0)); //#2313
          for (var _3A = 0, _39 = $1.len - 1; _3A <= _39; _3A += 1) { //#2324
              $1.i = _3A; //#2315
              $aload($get($1.p, ($1.i + 1) % $1.len)); //#2316
              var _3F = $k[--$j]; //#2316
              var _3G = $k[--$j]; //#2316
              var _3H = $k[--$j]; //#2316
              var _3I = $k[--$j]; //#2316
              var _3J = $k[--$j]; //#2316
              var _3K = $k[--$j]; //#2316
              $k[$j++] = _3I; //#2318
              $k[$j++] = _3H; //#2318
              $k[$j++] = _3G; //#2318
              $k[$j++] = _3F; //#2318
              $k[$j++] = _3K; //#2318
              $k[$j++] = _3I; //#2318
              $k[$j++] = $1.inkspreadh; //#2318
              if ($lt(_3F, _3J)) { //#2318
                  var _3M = $k[--$j]; //#2318
                  var _3N = $k[--$j]; //#2318
                  $k[$j++] = $f(_3N + _3M); //#2318
              } else { //#2318
                  var _3O = $k[--$j]; //#2318
                  var _3P = $k[--$j]; //#2318
                  $k[$j++] = $f(_3P - _3O); //#2318
              } //#2318
              var _3Q = $k[--$j]; //#2319
              var _3R = $k[--$j]; //#2319
              var _3S = $k[--$j]; //#2319
              var _3T = $k[--$j]; //#2319
              var _3U = $k[--$j]; //#2320
              $k[$j++] = _3U; //#2321
              $k[$j++] = _3Q; //#2321
              $k[$j++] = _3T; //#2321
              $k[$j++] = _3S; //#2321
              $k[$j++] = _3U; //#2321
              $k[$j++] = $1.inkspreadv; //#2321
              if ($gt(_3T, _3R)) { //#2321
                  var _3W = $k[--$j]; //#2321
                  var _3X = $k[--$j]; //#2321
                  $k[$j++] = $f(_3X + _3W); //#2321
              } else { //#2321
                  var _3Y = $k[--$j]; //#2321
                  var _3Z = $k[--$j]; //#2321
                  $k[$j++] = $f(_3Z - _3Y); //#2321
              } //#2321
              var _3a = $k[--$j]; //#2322
              var _3b = $k[--$j]; //#2322
              var _3c = $k[--$j]; //#2322
              var _3d = $k[--$j]; //#2322
              $k[$j++] = _3c; //#2323
              $k[$j++] = _3b; //#2323
              $k[$j++] = _3d; //#2323
              $k[$j++] = $f($1.pixy - _3a); //#2323
              if ($1.i == 0) { //#2323
                  var _3g = $k[--$j]; //#2323
                  $$.moveto($k[--$j], _3g); //#2323
              } else { //#2323
                  var _3i = $k[--$j]; //#2323
                  $$.lineto($k[--$j], _3i); //#2323
              } //#2323
          } //#2323
          $$.closepath(); //#2325
          $j -= 4; //#2326
      } //#2326
      $$.fill(); //#2328
      $1.pixs = $1.pixsorig; //#2330
  }; //#2332
  $1.drawlayerdots = function() {
      $1.pixsorig = $1.pixs; //#2336
      $1.pixs = $k[--$j]; //#2337
      $$.newpath(); //#2339
      for (var _3p = 0, _3o = $1.pixs.length - 1; _3p <= _3o; _3p += 1) { //#2347
          $1.x = _3p % $1.pixx; //#2341
          $1.y = ~~(_3p / $1.pixx); //#2342
          $k[$j++] = $1.x; //#2343
          $k[$j++] = $1.y; //#2343
          $1.xyget(); //#2343
          if ($k[--$j] == 1) { //#2346
              $$.moveto($f($1.x + 0.5), $f(($1.pixy - $1.y) - 0.5)); //#2344
              $$.arc($f($1.x + 0.5), $f(($1.pixy - $1.y) - 0.5), $f(0.5 - $1.inkspread), 0, 360, 1); //#2345
          } //#2345
      } //#2345
      $$.fill(); //#2348
      $1.pixs = $1.pixsorig; //#2350
  }; //#2352
  $$.save(); //#2354
  $1.inkspread = $1.inkspread / 2; //#2357
  $1.inkspreadh = $1.inkspreadh / 2; //#2358
  $1.inkspreadv = $1.inkspreadv / 2; //#2359
  var _46 = $$.currpos(); //#2360
  $$.translate(_46.x, _46.y); //#2360
  $$.scale(($1.width / $1.pixx) * 72, ($1.height / $1.pixy) * 72); //#2361
  $$.moveto(0, 0); //#2362
  $$.lineto($1.pixx, 0); //#2362
  $$.lineto($1.pixx, $1.pixy); //#2362
  $$.lineto(0, $1.pixy); //#2362
  $$.closepath(); //#2362
  if ($eq($1.colormap, "unset")) { //#2367
      var _4H = new Map([
          [1, $1.barcolor]
      ]); //#2366
      $1.colormap = _4H; //#2366
  } //#2366
  var _4I = $1.colormap; //#2369
  for (var _4N = _4I.size, _4M = _4I.keys(), _4L = 0; _4L < _4N; _4L++) { //#2375
      var _4J = _4M.next().value; //#2375
      $$.setcolor(_4I.get(_4J)); //#2370
      $1.key = _4J; //#2371
      $k[$j++] = Infinity; //#2373
      var _4O = $1.pixs; //#2373
      for (var _4P = 0, _4Q = _4O.length; _4P < _4Q; _4P++) { //#2373
          var _4T = $eq($get(_4O, _4P), $1.key) ? 1 : 0; //#2373
          $k[$j++] = _4T; //#2373
      } //#2373
      var _4U = $a(); //#2373
      $k[$j++] = _4U; //#2374
      if ($1.dotty) { //#2374
          $1.drawlayerdots(); //#2374
      } else { //#2374
          $1.drawlayer(); //#2374
      } //#2374
  } //#2374
  if ($ne($1.textcolor, "unset")) { //#2378
      $$.setcolor($1.textcolor); //#2378
  } //#2378
  if ($1.includetext) { //#2435
      if (($eq($1.textxalign, "unset") && $eq($1.textyalign, "unset")) && $eq($1.alttext, "")) { //#2433
          $1.s = 0; //#2381
          $1.fn = ""; //#2381
          var _4c = $1.txt; //#2382
          for (var _4d = 0, _4e = _4c.length; _4d < _4e; _4d++) { //#2391
              $forall($get(_4c, _4d)); //#2383
              var _4g = $k[--$j]; //#2384
              var _4h = $k[--$j]; //#2384
              $k[$j++] = _4h; //#2389
              $k[$j++] = _4g; //#2389
              if ((_4g != $1.s) || $ne(_4h, $1.fn)) { //#2388
                  var _4k = $k[--$j]; //#2385
                  var _4l = $k[--$j]; //#2385
                  $1.s = _4k; //#2385
                  $1.fn = _4l; //#2385
                  $$.selectfont(_4l, _4k); //#2386
              } else { //#2388
                  $j -= 2; //#2388
              } //#2388
              var _4m = $k[--$j]; //#2390
              $$.moveto($k[--$j], _4m); //#2390
              $$.show($k[--$j], 0, 0); //#2390
          } //#2390
      } else { //#2433
          $$.selectfont($1.textfont, $1.textsize); //#2393
          if ($eq($1.alttext, "")) { //#2399
              $k[$j++] = Infinity; //#2395
              var _4s = $1.txt; //#2395
              for (var _4t = 0, _4u = _4s.length; _4t < _4u; _4t++) { //#2395
                  $forall($get($get(_4s, _4t), 0)); //#2395
              } //#2395
              $1.txt = $a(); //#2395
              $1.tstr = $s($1.txt.length); //#2396
              for (var _52 = 0, _51 = $1.txt.length - 1; _52 <= _51; _52 += 1) { //#2397
                  $put($1.tstr, _52, $get($1.txt, _52)); //#2397
              } //#2397
          } else { //#2399
              $1.tstr = $1.alttext; //#2399
          } //#2399
          if ($1.tstr.length == 0) { //#2409
              $k[$j++] = 0; //#2404
          } else { //#2409
              $$.save(); //#2406
              $$.newpath(); //#2407
              $$.moveto(0, 0); //#2407
              $$.charpath("0", false); //#2407
              var _58 = $$.pathbbox(); //#2407
              $$.restore(); //#2409
              $k[$j++] = _58.ury; //#2409
          } //#2409
          $1.textascent = $k[--$j]; //#2418
          var _5B = $$.stringwidth($1.tstr); //#2419
          $1.textwidth = $f(_5B.w + (($1.tstr.length - 1) * $1.textgaps)); //#2419
          $1.textxpos = $f($1.textxoffset + ($f($1.x - $1.textwidth) / 2)); //#2421
          if ($eq($1.textxalign, "left")) { //#2422
              $1.textxpos = $1.textxoffset; //#2422
          } //#2422
          if ($eq($1.textxalign, "right")) { //#2423
              $1.textxpos = $f($f($1.x - $1.textxoffset) - $1.textwidth); //#2423
          } //#2423
          if ($eq($1.textxalign, "offleft")) { //#2424
              $1.textxpos = -$f($1.textwidth + $1.textxoffset); //#2424
          } //#2424
          if ($eq($1.textxalign, "offright")) { //#2425
              $1.textxpos = $f($1.x + $1.textxoffset); //#2425
          } //#2425
          if ($eq($1.textxalign, "justify") && ($1.textwidth < $1.x)) { //#2429
              $1.textxpos = 0; //#2427
              $1.textgaps = $f($1.x - $1.textwidth) / ($1.tstr.length - 1); //#2428
          } //#2428
          $1.textypos = -($f($f($1.textyoffset + $1.textascent) + 1)); //#2430
          if ($eq($1.textyalign, "above")) { //#2431
              $1.textypos = $f($f($1.textyoffset + $1.pixy) + 1); //#2431
          } //#2431
          if ($eq($1.textyalign, "center")) { //#2432
              $1.textypos = $f($1.textyoffset + ($f($1.pixy - $1.textascent) / 2)); //#2432
          } //#2432
          $$.moveto($1.textxpos, $1.textypos); //#2433
          $$.show($1.tstr, $1.textgaps, 0); //#2433
      } //#2433
  } //#2433
  $$.restore(); //#2437
}

function $an(a, b) { // and
  return (typeof a === 'boolean') ? a && b : a & b;
}

function $or(a, b) { // or
  return (typeof a === 'boolean') ? a || b : a | b;
}

function $astore(a) {
  for (var i = 0, l = a.length, b = a.b, o = a.o + l - 1; i < l; i++) {
      b[o - i] = $k[--$j];
  }
  $k[$j++] = a;
}

function $counttomark() {
  for (var i = $j - 1; i >= 0 && $k[i] !== Infinity; i--);
  return $j - i - 1;
}

function $lt(a, b) {
  if (a instanceof Uint8Array) {
      a = $z(a);
  }
  if (b instanceof Uint8Array) {
      b = $z(b);
  }
  return a < b;
}

function $gt(a, b) {
  if (a instanceof Uint8Array) {
      a = $z(a);
  }
  if (b instanceof Uint8Array) {
      b = $z(b);
  }
  return a > b;
}

// fontlib.js
var FontLib = (function() {
  var fonts = [];
  var names = {};
  var glyphcache = {};
  var glyphmru = {};
  var glyphcount = 0;

  // Sentinel to simplify moving entries around in the list.
  glyphmru.next = glyphmru;
  glyphmru.prev = glyphmru;

  return {
      lookup:lookup,
      monochrome:monochrome,
      getglyph:getglyph,
      getpaths:getpaths,
      loadFont:loadFont,
  };

  // loadFont(name, data)
  // loadFont(name, mult, data)
  // loadFont(name, multy, multx, data)   // note order: y,x
  // data must be the font data, either a binary or base64 encoded string.
  function loadFont(name /*...args*/) {
      var multx = 100;
      var multy = 100;
      var data = null;

      if (arguments.length == 2) {
          data = arguments[1];
      } else if (arguments.length == 3) {
          multx = multy = +arguments[1] || 100;
          data = arguments[2];
      } else if (arguments.length == 4) {
          multy = +arguments[1] || 100;
          multx = +arguments[2] || 100;
          data = arguments[3];
      } else {
          throw new Error("loadFont(): invalid number of arguments");
      }

      var font = STBTT.InitFont(toUint8Array(data));
      font.bwipjs_name = name;
      font.bwipjs_multx = multx;
      font.bwipjs_multy = multy;

      var fontid = fonts.push(font)-1;
      names[name.toUpperCase()] = fontid;
      return fontid;
  }

  // Always returns a valid font-id (default OCR-B)
  function lookup(name) {
      var fontid = names[name.toUpperCase()];
      return fontid === undefined ? 1 : fontid;       // OCR B default
  }

  // Not supported by stbtt
  function monochrome(mono) {
      if (mono) {
          throw new Error('fontlib: monochrome not implemented');
      }
  }

  function getglyph(fontid, charcode, width, height) {
      fontid   = fontid|0;
      charcode = charcode|0;
      width    = +width;
      height   = +height;
      if (!width || width < 8) {
          width = 8;
      }
      if (!height || height < 8) {
          height = width;
      }
      if (fontid < 0 || fontid >= fonts.length) {
          fontid = 1;     // OCR B default
      }
      if (!charcode || charcode < 32) {
          charcode = 32;
      }

      // In the cache?
      var cachekey = '' + fontid + 'c' + charcode + 'w' + width + 'h' + height; 
      var glyph = glyphcache[cachekey];
      if (glyph) {
          // Unthread from the MRU
          glyph.prev.next = glyph.next;
          glyph.next.prev = glyph.prev;

          // Thread back onto the top
          var sntl = glyphmru;
          sntl.next.prev = glyph;
          glyph.next = sntl.next;
          glyph.prev = sntl;
          sntl.next = glyph;
          
          return glyph;
      }

      var font = fonts[fontid];
      var glyph = STBTT.GetGlyph(font, charcode, width * font.bwipjs_multx / 100,
                                                 height * font.bwipjs_multy / 100);
      
      glyph.bytes = glyph.pixels;
      glyph.cachekey = cachekey;
      glyph.offset = 0;

      //glyph = {
      //      top:font.GlyphTop(),
      //      left:font.GlyphLeft(),
      //      width:font.GlyphWidth(),
      //      height:font.GlyphHeight(),
      //      advance:font.GlyphAdvance(),
      //      bitmap:font.GlyphBitmap(),
      //      offset:0,
      //      cachekey:cachekey,
      //  };

      // Purge old
      if (glyphcount > 250) {
          var sntl = glyphmru;
          var temp = sntl.prev;
          temp.prev.next = sntl;
          sntl.prev = temp.prev;
          temp.next = temp.prev = null;
          delete glyphcache[temp.cachekey];
      } else {
          glyphcount++;
      }

      // Add to cache and to the top of the MRU
      glyphcache[cachekey] = glyph;

      var sntl = glyphmru;
      sntl.next.prev = glyph;
      glyph.next = sntl.next;
      glyph.prev = sntl;
      sntl.next = glyph;

      return glyph;
  }

  function getpaths(fontid, charcode, width, height) {
      fontid   = fontid|0;
      charcode = charcode|0;
      width    = +width;
      height   = +height;
      if (!width || width < 8) {
          width = 8;
      }
      if (!height || height < 8) {
          height = width;
      }
      if (fontid < 0 || fontid >= fonts.length) {
          fontid = 1;     // OCR B default
      }
      if (!charcode || charcode < 32) {
          charcode = 32;
      }

      var font = fonts[fontid];
      return STBTT.GetPaths(font, charcode, width * font.bwipjs_multx / 100,
                                            height * font.bwipjs_multy / 100);
  }
})();

module.exports = {
  toCanvas:ToCanvas
}

