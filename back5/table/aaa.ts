let aaa = [
  // 材料
  { id: 'material_01', kind1: '材料', kind2: '光敏树脂', code: '9100', name: '9100', color: '', remark: '', url_img: '', price: 278.52 }, //
  { id: 'material_02', kind1: '材料', kind2: '光敏树脂', code: '9200', name: '9200', color: '', remark: '', url_img: '', price: 214.24 }, //
  { id: 'material_03', kind1: '材料', kind2: '高分子粉末', code: '1001', name: '1001', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_04', kind1: '材料', kind2: '高分子粉末', code: '1001', name: '1001', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_05', kind1: '材料', kind2: '金属粉末', code: '2001', name: '2001', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_06', kind1: '材料', kind2: '金属粉末', code: '2002', name: '2002', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_07', kind1: '材料', kind2: '线材', code: '3001', name: '3001', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_08', kind1: '材料', kind2: '线材', code: '3002', name: '3002', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_09', kind1: '材料', kind2: '陶瓷', code: '4001', name: '4001', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_10', kind1: '材料', kind2: '陶瓷', code: '4002', name: '4002', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_11', kind1: '材料', kind2: '尼龙', code: '5001', name: '5001', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'material_12', kind1: '材料', kind2: '尼龙', code: '5002', name: '5002', color: '', remark: '', url_img: '', price: 0 }, //

  //   打磨
  { id: 'polish_01', kind1: '打磨', kind2: '', name: '粗磨', code: '300', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'polish_02', kind1: '打磨', kind2: '', name: '粗磨#400', code: '400', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'polish_03', kind1: '打磨', kind2: '', name: '粗磨#800', code: '800', color: '', remark: '', url_img: '', price: 0 }, //
  { id: 'polish_04', kind1: '打磨', kind2: '', name: '精磨#800', code: '1200', color: '', remark: '', url_img: '', price: 0 }, //

  //   喷漆哑光
  { id: 'paint_u01', kind1: '喷漆', kind2: '哑光', name: '871U', code: '871U', color: '871U', remark: '', url_img: '', price: 0 }, //
  { id: 'paint_u02', kind1: '喷漆', kind2: '哑光', name: '872U', code: '872U', color: '872U', remark: '', url_img: '', price: 0 }, //
  { id: 'paint_u03', kind1: '喷漆', kind2: '哑光', name: '873U', code: '873U', color: '873U', remark: '', url_img: '', price: 0 }, //

  //   喷漆亮光
  { id: 'paint_c01', kind1: '喷漆', kind2: '亮光', name: '871C', code: '871C', color: '871C', remark: '', url_img: '', price: 0 }, //
  { id: 'paint_c02', kind1: '喷漆', kind2: '亮光', name: '872C', code: '872C', color: '872C', remark: '', url_img: '', price: 0 }, //
  { id: 'paint_c03', kind1: '喷漆', kind2: '亮光', name: '873C', code: '873C', color: '873C', remark: '', url_img: '', price: 0 }, //

  //螺母
  { id: 'nut_n01', kind1: '螺母', kind2: '', name: 'M2*2', code: 'M2*2', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'nut_n02', kind1: '螺母', kind2: '', name: 'M2*3', code: 'M2*3', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'nut_n03', kind1: '螺母', kind2: '', name: 'M2*5', code: 'M2*5', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'nut_n04', kind1: '螺母', kind2: '', name: 'M3*3', code: 'M3*3', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'nut_n05', kind1: '螺母', kind2: '', name: 'M3*5', code: 'M3*5', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'nut_n06', kind1: '螺母', kind2: '', name: 'M4*4', code: 'M4*4', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'nut_n07', kind1: '螺母', kind2: '', name: 'M4*8', code: 'M4*8', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //

  //层高
  { id: 'height_01', kind1: '层高', kind2: '', name: '0.1mm', code: '0.1mm', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
  { id: 'height_02', kind1: '层高', kind2: '', name: '0.05mm', code: '0.05mm', color: '', remark: '', url_img: '', price: 0, length: 0, with: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
]
