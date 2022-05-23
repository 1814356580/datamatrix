const app = getApp()


var dm = require('../util/datamatrix')


Page({
  data: {

  },
  onLoad() {
    const query = wx.createSelectorQuery()
    query.select('#canvans')
      .fields({ node: true, size: true })
      .exec((res) => { 
        const canvas = res[0].node;
        dm.toCanvas({
          bcid: 'datamatrix',       // Barcode type
          text: '1234235',    // Text to encode
          // scale: 10, // 缩放比例
          height: 100, // 高
          width: 100, // 宽
          includetext: true,            // Show human-readable text
          textxalign: 'center',        // Always good to set this
        }, canvas);
    
      })

  },
})
