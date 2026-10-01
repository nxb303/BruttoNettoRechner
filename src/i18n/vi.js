/**
 * Từ điển tiếng Việt. Các thuật ngữ tiếng Đức được ghi trong ngoặc và đánh dấu bằng
 * `[de:thuật ngữ]` để trình đọc màn hình đọc chúng bằng tiếng Đức (`lang="de"`).
 * Tiếng Việt chỉ có dạng số nhiều `other` (xem `Intl.PluralRules('vi')`).
 */
export default {
  // ------------------------------------------------------------ Items
  'item.incomeTax': 'Thuế tiền lương ([de:Lohnsteuer])',
  'item.solidarity': 'Phụ thu đoàn kết ([de:Solidaritätszuschlag])',
  'item.churchTax': 'Thuế nhà thờ ([de:Kirchensteuer])',
  'item.health': 'Bảo hiểm y tế ([de:Krankenversicherung])',
  'item.healthAdditional': 'Phí bổ sung bảo hiểm y tế ([de:Zusatzbeitrag])',
  'item.care': 'Bảo hiểm chăm sóc dài hạn ([de:Pflegeversicherung])',
  'item.careSurcharge': 'Phụ phí bảo hiểm chăm sóc dài hạn cho người không có con ([de:Beitragszuschlag für Kinderlose])',
  'item.pension': 'Bảo hiểm hưu trí ([de:Rentenversicherung])',
  'item.unemployment': 'Bảo hiểm thất nghiệp ([de:Arbeitslosenversicherung])',
  'item.pkv': 'Bảo hiểm y tế tư nhân, gói cơ bản ([de:Private Krankenversicherung])',
  'item.ppv': 'Bảo hiểm chăm sóc dài hạn bắt buộc tư nhân ([de:Private Pflege-Pflichtversicherung])',
  'item.employerSubsidy': 'Khoản hỗ trợ của người sử dụng lao động, miễn thuế ([de:Arbeitgeberzuschuss])',
  'item.net': 'Lương thực nhận ([de:Nettogehalt])',
  'item.employer.health': 'Phần của người sử dụng lao động trong bảo hiểm y tế',
  'item.employer.healthAdditional': 'Phần của người sử dụng lao động trong phí bổ sung',
  'item.employer.care': 'Phần của người sử dụng lao động trong bảo hiểm chăm sóc dài hạn',
  'item.employer.pension': 'Phần của người sử dụng lao động trong bảo hiểm hưu trí',
  'item.employer.unemployment': 'Phần của người sử dụng lao động trong bảo hiểm thất nghiệp',
  'item.employer.subsidy': 'Khoản hỗ trợ cho bảo hiểm y tế và chăm sóc dài hạn tư nhân',
  'item.employer.minijobPension': 'Đóng góp hưu trí khoán (minijob)',
  'item.employer.minijobHealth': 'Đóng góp y tế khoán (minijob)',
  'item.employer.minijobTax': 'Thuế khoán (minijob)',

  // ------------------------------------------------------------ Result
  'result.employment.minijob': 'Minijob – việc làm thu nhập thấp ([de:geringfügige Beschäftigung])',
  'result.employment.midijob': 'Midijob – vùng chuyển tiếp ([de:Übergangsbereich])',
  'result.employment.regular': 'Việc làm thông thường',
  'result.deduct': 'trừ',
  'result.add': 'cộng',
  'result.explain.net': 'Lương thực nhận ([de:Nettogehalt])',
  'result.sources.external': '(mở trang web bên ngoài trong tab mới)',
  'result.sources.meta': '{publisher}, cập nhật đến {date}, truy cập ngày {accessed}',
  'result.sources.metaNoDate': '{publisher}, truy cập ngày {accessed}',
  'result.bar.label':
    'Cơ cấu lương gộp: thực nhận {net} ({netShare}), thuế {taxes} ({taxesShare}), bảo hiểm xã hội {social} ({socialShare})',

  // --------------------------------------------------------- Notes
  'warn.factorOnlyClass4': 'Hệ số chỉ áp dụng cho nhóm thuế IV và đã được bỏ qua ở đây.',
  'warn.class2NeedsChild':
    'Nhóm thuế II dành cho người nuôi con một mình, có ít nhất một con sống trong hộ. Khoản giảm trừ cho người nuôi con một mình đã được áp dụng – vui lòng kiểm tra xem nhóm thuế II có phù hợp với bạn không.',
  'warn.childAllowancesClass56': 'Ở nhóm thuế V và VI không tính mức miễn thuế cho con.',
  'warn.midijob':
    'Mức lương của bạn nằm trong vùng chuyển tiếp ({limit} đến {upper}): các khoản đóng bảo hiểm xã hội được tính từ một số tiền đã giảm, còn thuế tiền lương được tính từ toàn bộ lương gộp.',
  'warn.minijobFlatTax':
    'Minijob: bạn không phải nộp thuế tiền lương. Chúng tôi giả định người sử dụng lao động nộp thuế khoán {rate}. Bạn chỉ đóng phần của mình vào bảo hiểm hưu trí (có thể xin miễn).',
  'warn.minijobNoHealth':
    'Trong minijob bạn không đóng bảo hiểm y tế và bảo hiểm chăm sóc dài hạn; các thông tin về bảo hiểm y tế tư nhân đã được bỏ qua.',
  'warn.pkvBelowJaeg':
    'Bảo hiểm y tế tư nhân nhìn chung chỉ dành cho người lao động có thu nhập hằng năm vượt ngưỡng bắt buộc tham gia bảo hiểm là {limit} (công chức và người làm nghề tự do theo quy định khác).',

  // -------------------------------------------------------- Error messages
  'err.gross.required': 'Vui lòng nhập lương gộp của bạn.',
  'err.gross.invalid': 'Lương gộp không phải là số hợp lệ. Ví dụ: 4.000 hoặc 4.000,50.',
  'err.gross.range': 'Lương gộp phải lớn hơn 0 và không vượt quá {max}.',
  'err.gross.decimals': 'Vui lòng nhập tối đa hai chữ số thập phân.',
  'err.factor.invalid': 'Hệ số không phải là số hợp lệ. Ví dụ: 0,912.',
  'err.factor.range': 'Hệ số phải nằm trong khoảng từ 0,001 đến 0,999 (tối đa ba chữ số thập phân).',
  'err.additionalRate.required': 'Vui lòng nhập mức phí bổ sung của quỹ bảo hiểm y tế của bạn.',
  'err.additionalRate.invalid': 'Mức phí bổ sung không phải là số hợp lệ. Ví dụ: 2,9.',
  'err.additionalRate.range': 'Mức phí bổ sung phải nằm trong khoảng từ 0 đến 10 phần trăm (tối đa hai chữ số thập phân).',
  'err.premium.required': 'Vui lòng nhập phí bảo hiểm hằng tháng (nhập 0 nếu không có).',
  'err.premium.invalid': 'Phí bảo hiểm không phải là số hợp lệ. Ví dụ: 450,50.',
  'err.premium.range': 'Phí bảo hiểm hằng tháng phải nằm trong khoảng từ 0 đến {max} (tối đa hai chữ số thập phân).',
  'err.allowance.invalid': 'Mức miễn thuế không phải là số hợp lệ. Ví dụ: 125,50.',
  'err.allowance.range': 'Mức miễn thuế phải nằm trong khoảng từ 0 đến {max} (tối đa hai chữ số thập phân).',
  'err.children.required': 'Vui lòng nhập số con dưới 25 tuổi.',
  'err.children.invalid': 'Vui lòng nhập một số nguyên.',
  'err.children.range': 'Số con phải nằm trong khoảng từ 0 đến 10.',
  'err.generic': 'Vui lòng kiểm tra mục này.',

  // ---------------------------------------------------------- Dynamic text in the browser
  'js.live.result': 'Thực nhận: {monthly} mỗi tháng, {yearly} mỗi năm.',
  'js.live.invalid': 'Vui lòng sửa các mục được đánh dấu.',
  'js.invalidResult': 'Vui lòng sửa các mục được đánh dấu để xem kết quả.',
  'js.errors.field': '{label}: {message}',

  // ---------------------------------------------------------- Calculation steps
  'explain.sv.step.base':
    'Cơ sở tính đóng góp: {base} (lương gộp; không vượt mức trần đóng góp hằng tháng {ceiling}).',
  'explain.sv.step.baseCapped':
    'Cơ sở tính đóng góp: lương gộp {gross} vượt mức trần đóng góp hằng tháng {ceiling}, vì vậy dùng {base}.',
  'explain.sv.step.amount': '{base} × {rate} = {amount}',
  'explain.health.step.rate':
    'Mức đóng chung là {total}. Người lao động đóng một nửa, tức là {rate}.',
  'explain.healthAdditional.step.rate':
    'Mức phí bổ sung của quỹ bảo hiểm y tế của bạn là {total}. Người lao động đóng một nửa, tức là {rate}.',
  'explain.care.step.rate':
    'Mức đóng bảo hiểm chăm sóc dài hạn là {total}. Người lao động đóng một nửa, tức là {rate}.',
  'explain.care.step.rateSaxony':
    'Mức đóng bảo hiểm chăm sóc dài hạn là {total}. Tại Sachsen, người lao động đóng {rate} và người sử dụng lao động đóng {employerRate}, vì ngày lễ [de:Buß- und Bettag] (Ngày Sám hối và Cầu nguyện) ở đó vẫn được giữ lại.',
  'explain.care.step.reduction': {
    other:
      'Giảm mức đóng cho con dưới 25 tuổi: {perChild} cho mỗi con, với {count} con được tính (từ con thứ hai, tối đa bốn lần giảm), tổng cộng giảm {reduction}. Phần của người lao động được giảm tương ứng.',
  },
  'explain.care.step.reductionMidijob': {
    other:
      'Trừ khoản giảm mức đóng cho {count} con được tính: {base} × {reduction} = {amount}. Phần của người lao động sau khi giảm: {result}.',
  },
  'explain.careSurcharge.step.rate':
    'Người không có con phải đóng phụ phí {rate} kể từ sinh nhật lần thứ 23. Người lao động tự chịu khoản này.',
  'explain.pension.step.rate':
    'Mức đóng bảo hiểm hưu trí là {total}. Người lao động đóng một nửa, tức là {rate}.',
  'explain.unemployment.step.rate':
    'Mức đóng bảo hiểm thất nghiệp là {total}. Người lao động đóng một nửa, tức là {rate}.',
  'explain.midijob.step.be':
    'Vùng chuyển tiếp: cơ sở tính đóng góp cho tổng đóng góp và phụ phí là BE = F × G + (OG ÷ (OG − G) − G ÷ (OG − G) × F) × (AE − G). Với AE = {gross}, G = {g}, OG = {og} và F = {f}, kết quả là {be}.',
  'explain.midijob.step.beAn':
    'Vùng chuyển tiếp: cơ sở tính đóng góp cho phần của người lao động là BE_AN = OG ÷ (OG − G) × (AE − G). Với AE = {gross}, G = {g} và OG = {og}, kết quả là {beAn}.',
  'explain.minijob.step.pensionRate':
    'Mức đóng bảo hiểm hưu trí {total} trừ mức khoán của người sử dụng lao động {employer} = phần của người lao động là {rate} tiền công.',
  'explain.minijob.step.pensionExempt':
    'Bạn được miễn bảo hiểm hưu trí bắt buộc. Bạn không đóng phần của mình; người sử dụng lao động vẫn đóng khoản đóng góp khoán.',
  'explain.incomeTax.step.minijob':
    'Trong minijob, người lao động không nộp thuế tiền lương: giả định người sử dụng lao động nộp thuế khoán {rate}.',

  'explain.incomeTax.step.annual':
    'Lương cả năm: lương gộp hằng tháng {monthly} × 12 = {annual} (giả định: lương như nhau trong cả mười hai tháng).',
  'explain.incomeTax.step.allowance': 'Trừ mức miễn thuế trong dữ liệu khấu trừ thuế (ELStAM): {monthly} × 12 = {annual}.',
  'explain.incomeTax.step.anp': 'Trừ mức khoán chi phí liên quan đến thu nhập của người lao động ([de:Arbeitnehmer-Pauschbetrag]): {amount}.',
  'explain.incomeTax.step.sap': 'Trừ mức khoán chi tiêu đặc biệt ([de:Sonderausgaben-Pauschbetrag]): {amount}.',
  'explain.incomeTax.step.efa': 'Trừ khoản giảm trừ cho người nuôi con một mình (nhóm thuế II): {amount}.',
  'explain.incomeTax.step.vspPension':
    'Khoản khấu trừ khoán cho bảo hiểm ([de:Vorsorgepauschale]), phần bảo hiểm hưu trí: {base} (lương cả năm, tối đa đến mức trần đóng góp {ceiling}) × {rate} = {amount}.',
  'explain.incomeTax.step.vspHealth':
    'Khoản khấu trừ khoán, phần bảo hiểm y tế và chăm sóc dài hạn: {base} (lương cả năm, tối đa đến mức trần đóng góp {ceiling}) × (bảo hiểm y tế {kvRate} + bảo hiểm chăm sóc dài hạn {pvRate}) = {amount}.',
  'explain.incomeTax.step.vspPrivate':
    'Khoản khấu trừ khoán, phần bảo hiểm y tế tư nhân và bảo hiểm chăm sóc dài hạn bắt buộc tư nhân: (phí hằng tháng {premium} − khoản hỗ trợ của người sử dụng lao động {subsidy}) × 12 = {amount}.',
  'explain.incomeTax.step.vspUnemployment':
    'Khoản khấu trừ khoán, phần bảo hiểm thất nghiệp: {base} × {rate} = {amount}.',
  'explain.incomeTax.step.vspCap':
    'Các phần cho bảo hiểm thất nghiệp, y tế và chăm sóc dài hạn ({sum}) bị giới hạn ở mức tối đa {cap}: {result}.',
  'explain.incomeTax.step.vspTotal':
    'Khoản khấu trừ khoán là số cao hơn trong hai số tiền, mỗi số được làm tròn lên đến euro nguyên: hưu trí + y tế và chăm sóc dài hạn = {a}, hoặc hưu trí + số tiền đã giới hạn = {b}. Kết quả: {result}.',
  'explain.incomeTax.step.vspTotalSimple': 'Tổng khoản khấu trừ khoán (làm tròn lên đến euro nguyên): {result}.',
  'explain.incomeTax.step.taxableIncome':
    'Thu nhập chịu thuế = {annual} − {deductions} (các mức khoán) − {vsp} (khoản khấu trừ khoán cho bảo hiểm) = {zve}.',
  'explain.incomeTax.step.tariffBase':
    'Để áp dụng biểu thuế thu nhập, thu nhập chịu thuế {zve} được làm tròn xuống đến euro nguyên: X = {x}.',
  'explain.incomeTax.step.tariffBaseSplitting':
    'Nhóm thuế III (chia đôi thu nhập vợ chồng): thu nhập chịu thuế {zve} được chia đôi và làm tròn xuống đến euro nguyên: X = {x}. Sau đó thuế được nhân đôi.',
  'explain.incomeTax.step.tariffZone0':
    'X = {x} không vượt quá mức miễn thuế cơ bản {gfb}: thuế thu nhập là {result}.',
  'explain.incomeTax.step.tariffZone1':
    'Vùng thuế 1 (§ 32a Abs. 1 Nr. 2 EStG): y = (X − {gfb}) ÷ 10.000 = {y}. Thuế = ({a} × y + {b}) × y = {result} (làm tròn xuống đến euro nguyên).',
  'explain.incomeTax.step.tariffZone2':
    'Vùng thuế 2 (§ 32a Abs. 1 Nr. 3 EStG): z = (X − {offset}) ÷ 10.000 = {z}. Thuế = ({a} × z + {b}) × z + {c} = {result} (làm tròn xuống đến euro nguyên).',
  'explain.incomeTax.step.tariffZone3':
    'Vùng thuế 3 (§ 32a Abs. 1 Nr. 4 EStG): thuế = {rate} × X − {constant} = {result} (làm tròn xuống đến euro nguyên).',
  'explain.incomeTax.step.tariffZone4':
    'Vùng thuế 4 (§ 32a Abs. 1 Nr. 5 EStG): thuế = {rate} × X − {constant} = {result} (làm tròn xuống đến euro nguyên).',
  'explain.incomeTax.step.splittingDouble':
    'Chia đôi thu nhập vợ chồng: thuế cho X = {single}, nhân đôi = {result}.',
  'explain.incomeTax.step.tariffV56Zone1':
    'Nhóm thuế V và VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} đến {w1}: thuế bằng hai lần chênh lệch giữa thuế thu nhập tính trên 1,25 lần X và trên 0,75 lần X, nhưng tối thiểu 14% của X: {result}.',
  'explain.incomeTax.step.tariffV56Zone2':
    'Nhóm thuế V và VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} nằm giữa {w1} và {w2}: áp dụng giá trị thấp hơn trong hai giá trị – thuế theo phương pháp chênh lệch, hoặc thuế cho {w1} cộng 42% phần vượt trên mức đó: {result}.',
  'explain.incomeTax.step.tariffV56Zone3':
    'Nhóm thuế V và VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} nằm giữa {w2} và {w3}: thuế cho {w2} theo phương pháp chênh lệch cộng 42% phần vượt trên mức đó: {result}.',
  'explain.incomeTax.step.tariffV56Zone4':
    'Nhóm thuế V và VI (§ 39b Abs. 2 Satz 7 EStG), X = {x} vượt {w3}: thuế cho {w2} theo phương pháp chênh lệch, cộng 42% phần đến {w3} và 45% phần vượt trên mức đó: {result}.',
  'explain.incomeTax.step.factor':
    'Phương pháp hệ số (nhóm thuế IV): {tax} × hệ số {factor} = {result} (làm tròn xuống đến euro nguyên).',
  'explain.incomeTax.step.annualTax': 'Thuế tiền lương cả năm: {result}.',
  'explain.incomeTax.step.monthlyTax': 'Thuế tiền lương hằng tháng = {annual} ÷ 12, làm tròn xuống đến cent nguyên: {result}.',
  'explain.incomeTax.step.childrenNote':
    'Mức miễn thuế cho con ({count}) không làm giảm thuế tiền lương; chúng chỉ ảnh hưởng đến phụ thu đoàn kết và thuế nhà thờ.',

  'explain.solidarity.step.base': 'Cơ sở tính là thuế tiền lương cả năm: {base}.',
  'explain.solidarity.step.baseChildren':
    'Cơ sở tính là thuế tiền lương cả năm sau khi trừ mức miễn thuế cho con ({allowances} khỏi thu nhập): {base} (khi không tính mức miễn thuế cho con: {tax}).',
  'explain.solidarity.step.belowLimit':
    '{base} không vượt ngưỡng miễn {limit}: không phải nộp phụ thu đoàn kết.',
  'explain.solidarity.step.aboveLimit':
    'Vượt ngưỡng miễn {limit}. Phụ thu đầy đủ: {base} × {rate} = {full}. Vùng giảm dần: ({base} − {limit}) × {mitigationRate} = {mitigation}. Áp dụng giá trị thấp hơn: {result}.',
  'explain.solidarity.step.monthly': 'Phần mỗi tháng: {annual} ÷ 12, làm tròn xuống đến cent nguyên: {result}.',

  'explain.churchTax.step.base':
    'Thuế gốc (thuế tiền lương cả năm, đã trừ mức miễn thuế cho con nếu có): {annual}. Phần mỗi tháng ({annual} ÷ 12, làm tròn xuống): {result}.',
  'explain.churchTax.step.amount': '{base} × {rate} ({state}) = {amount}, làm tròn xuống đến cent nguyên.',

  'explain.pkv.step.premium':
    'Phí hằng tháng cho bảo hiểm y tế tư nhân gói cơ bản như bạn đã nhập: {premium}. Khoản này được trừ toàn bộ khỏi lương thực nhận.',
  'explain.ppv.step.premium':
    'Phí hằng tháng cho bảo hiểm chăm sóc dài hạn bắt buộc tư nhân như bạn đã nhập: {premium}. Khoản này được trừ toàn bộ khỏi lương thực nhận.',
  'explain.employerSubsidy.step.health':
    'Bảo hiểm y tế: một nửa phí {premium} = {half}, tối đa {cap} (mức trần đóng góp {ceiling} × {rate}, tương đương phần của người sử dụng lao động trong bảo hiểm y tế công với một nửa mức phí bổ sung bình quân). Khoản hỗ trợ: {result}.',
  'explain.employerSubsidy.step.care':
    'Bảo hiểm chăm sóc dài hạn: một nửa phí {premium} = {half}, tối đa {cap} (mức trần đóng góp {ceiling} × {rate}, phần của người sử dụng lao động trong bảo hiểm chăm sóc dài hạn công). Khoản hỗ trợ: {result}.',
  'explain.employerSubsidy.step.total':
    'Tổng khoản hỗ trợ miễn thuế của người sử dụng lao động là {result}. Khoản này được cộng vào lương thực nhận.',

  'explain.net.step.sum': 'Thực nhận = lương gộp {gross} − thuế {taxes} − bảo hiểm xã hội {social} = {net}.',
  'explain.net.step.sumPrivate':
    'Thực nhận = lương gộp {gross} − thuế {taxes} − bảo hiểm xã hội {social} (gồm phí bảo hiểm tư nhân trừ khoản hỗ trợ của người sử dụng lao động) = {net}.',

  // ------------------------------------------------------------ States
  'state.BW': '[de:Baden-Württemberg]',
  'state.BY': '[de:Bayern]',
  'state.BE': '[de:Berlin]',
  'state.BB': '[de:Brandenburg]',
  'state.HB': '[de:Bremen]',
  'state.HH': '[de:Hamburg]',
  'state.HE': '[de:Hessen]',
  'state.MV': '[de:Mecklenburg-Vorpommern]',
  'state.NI': '[de:Niedersachsen]',
  'state.NW': '[de:Nordrhein-Westfalen]',
  'state.RP': '[de:Rheinland-Pfalz]',
  'state.SL': '[de:Saarland]',
  'state.SN': '[de:Sachsen]',
  'state.ST': '[de:Sachsen-Anhalt]',
  'state.SH': '[de:Schleswig-Holstein]',
  'state.TH': '[de:Thüringen]',

  // ------------------------------------------------------------ Sources
  'source.bmf-pap-2026.title':
    'Bộ Tài chính Liên bang (BMF): sơ đồ quy trình khấu trừ thuế tiền lương năm 2026 (công văn BMF ngày 12/11/2025)',
  'source.bmf-pap-2026-xml.title':
    'Bộ Tài chính Liên bang / ITZBund: sơ đồ quy trình năm 2026 dưới dạng mã giả XML (công cụ tính thuế tiền lương và thuế thu nhập)',
  'source.bmf-vsp-2026.title':
    'Công văn BMF ngày 14/8/2025: khoản khấu trừ khoán cho bảo hiểm trong thủ tục khấu trừ thuế tiền lương từ năm 2026',
  'source.estg-32a.title': '§ 32a EStG – biểu thuế thu nhập',
  'source.estg-39b.title': '§ 39b EStG – khấu trừ thuế tiền lương',
  'source.estg-9a.title': '§ 9a EStG – mức khoán chi phí liên quan đến thu nhập',
  'source.estg-10c.title': '§ 10c EStG – mức khoán chi tiêu đặc biệt',
  'source.estg-24b.title': '§ 24b EStG – khoản giảm trừ cho người nuôi con một mình',
  'source.estg-32.title': '§ 32 EStG – con cái, mức miễn thuế cho con',
  'source.estg-40a.title': '§ 40a EStG – thuế tiền lương khoán trong các trường hợp đặc biệt (minijob)',
  'source.estg-51a.title': '§ 51a EStG – xác định và thu thuế phụ thu (thuế nhà thờ)',
  'source.solzg-3.title': '§ 3 Luật phụ thu đoàn kết 1995 (SolzG 1995) – cơ sở tính, ngưỡng miễn',
  'source.solzg-4.title': '§ 4 Luật phụ thu đoàn kết 1995 (SolzG 1995) – mức phụ thu, vùng giảm dần',
  'source.kist-saetze.title': 'Thành phố Tự do và Hanse Hamburg: cách tính thuế nhà thờ (mức 8% hoặc 9%)',
  'source.kistg-bb.title': 'Luật thuế nhà thờ của bang Brandenburg (BbgKiStG)',
  'source.kistg-hb.title': 'Luật thuế nhà thờ của Bremen (KiStG), phiên bản ngày 23/8/2001',
  'source.kistg-nw.title': 'Luật thuế nhà thờ của bang Nordrhein-Westfalen (KiStG), bản hợp nhất ngày 29/11/2019',
  'source.svbezgrv-2026.title': 'Nghị định về các đại lượng tính toán của bảo hiểm xã hội năm 2026 (BGBl. 2025 I Nr. 278)',
  'source.sgb5-241.title': '§ 241 SGB V – mức đóng chung',
  'source.sgb5-242.title': '§ 242 SGB V – phí bổ sung',
  'source.sgb5-242a.title': '§ 242a SGB V – mức phí bổ sung bình quân',
  'source.sgb5-249.title': '§ 249 SGB V – phân chia nghĩa vụ đóng góp trong việc làm bắt buộc tham gia bảo hiểm',
  'source.sgb5-249b.title': '§ 249b SGB V – đóng góp của người sử dụng lao động cho việc làm thu nhập thấp',
  'source.sgb5-257.title': '§ 257 SGB V – hỗ trợ phí bảo hiểm cho người lao động (bảo hiểm y tế tư nhân)',
  'source.bmg-zusatzbeitrag-2026.title':
    'Bộ Y tế Liên bang: mức đóng bảo hiểm y tế công, mức phí bổ sung bình quân năm 2026',
  'source.sgb11-55.title': '§ 55 SGB XI – mức đóng, khoản giảm và phụ phí',
  'source.sgb11-58.title': '§ 58 SGB XI – phân chia nghĩa vụ đóng góp của người lao động tham gia bảo hiểm bắt buộc',
  'source.sgb11-61.title': '§ 61 SGB XI – hỗ trợ phí bảo hiểm cho người lao động (bảo hiểm chăm sóc dài hạn tư nhân)',
  'source.sgb6-158.title': '§ 158 SGB VI – mức đóng',
  'source.sgb6-168.title': '§ 168 SGB VI – phân chia nghĩa vụ đóng góp của người lao động',
  'source.sgb6-172.title': '§ 172 SGB VI – đóng góp của người sử dụng lao động cho việc làm thu nhập thấp',
  'source.sgb3-341.title': '§ 341 SGB III – mức đóng bảo hiểm thất nghiệp',
  'source.sgb4-8.title': '§ 8 SGB IV – việc làm thu nhập thấp và hoạt động tự doanh thu nhập thấp',
  'source.sgb4-20.title': '§ 20 SGB IV – thu nhập chịu đóng góp, vùng chuyển tiếp',
  'source.bmas-faktor-f-2026.title':
    'Bộ Lao động và Các vấn đề Xã hội Liên bang: thông báo hệ số F cho vùng chuyển tiếp năm 2026 (BAnz AT 18.12.2025 B5)',
  'source.milov5.title': 'Nghị định điều chỉnh mức lương tối thiểu lần thứ năm (MiLoV 5)',
  'source.rs-uebergangsbereich.title':
    'Công văn chung của GKV-Spitzenverband, Deutsche Rentenversicherung Bund và Bundesagentur für Arbeit: việc làm trong vùng chuyển tiếp từ 1/1/2023',
  'source.bvv-2.title': '§ 2 Nghị định về thủ tục đóng góp (BVV) – cách tính đóng góp',

  // ============================================================ Static page texts (pre-rendering only)
  'meta.title': 'Máy tính lương Brutto–Netto tại Đức {year}: lương, thuế, bảo hiểm xã hội',
  'meta.description':
    'Máy tính lương gộp sang lương thực nhận miễn phí cho nước Đức ({year}) dựa trên sơ đồ quy trình chính thức của BMF. Chạy hoàn toàn trong trình duyệt của bạn – không cookie, có diễn giải phép tính và nguồn dẫn.',
  'site.name': 'Máy tính lương Brutto–Netto',
  'site.title': 'Máy tính lương Brutto\u2060–\u2060Netto tại Đức {year}',
  'site.lead':
    'Tính lương thực nhận của bạn theo sơ đồ quy trình chính thức của Bộ Tài chính Liên bang Đức – ngay trong trình duyệt, không cookie, kèm diễn giải phép tính và nguồn dẫn.',
  'noscript': 'Cần bật JavaScript để tính toán. Mọi phép tính chạy cục bộ trong trình duyệt của bạn; không có dữ liệu nào được gửi đi.',
  'nav.skip': 'Chuyển đến máy tính',
  'nav.skipContent': 'Chuyển đến nội dung',
  'nav.language': 'Ngôn ngữ',
  'nav.back': 'Quay lại máy tính',
  'nav.home': 'Máy tính',
  'page.legal.slug': 'thong-tin-phap-ly',
  'page.notFound.title': 'Không tìm thấy trang',
  'page.notFound.text': 'Trang được yêu cầu không tồn tại (hoặc không còn tồn tại).',
  'page.privacy.slug': 'bao-mat',

  'form.title': 'Thông tin của bạn',
  'form.errors.title': 'Vui lòng sửa các mục sau',
  'form.salary.legend': 'Lương',
  'form.gross.label': 'Lương gộp ([de:Brutto])',
  'form.gross.placeholder': 'ví dụ 4.000',
  'form.gross.hint': 'Số tiền tính bằng euro, có thể có cent (ví dụ 4.000,50).',
  'form.period.legend': 'Kỳ lương',
  'form.period.month': 'mỗi tháng',
  'form.period.year': 'mỗi năm',
  'form.year.label': 'Năm thuế',
  'form.minijob.exempt': 'Được miễn bảo hiểm hưu trí bắt buộc',
  'form.minijob.hint': 'Trong minijob (đến {minijobLimit} mỗi tháng) bạn có thể đề nghị được miễn bảo hiểm hưu trí bắt buộc.',
  'form.tax.legend': 'Thuế',
  'form.taxClass.label': 'Nhóm thuế ([de:Steuerklasse])',
  'form.taxClass.1': 'I – độc thân',
  'form.taxClass.2': 'II – nuôi con một mình',
  'form.taxClass.3': 'III – đã kết hôn, thu nhập cao hơn',
  'form.taxClass.4': 'IV – đã kết hôn, thu nhập tương đương',
  'form.taxClass.5': 'V – đã kết hôn, thu nhập thấp hơn',
  'form.taxClass.6': 'VI – việc làm thứ hai trở lên',
  'form.state.label': 'Bang (nơi cư trú và làm việc)',
  'form.churchTax.legend': 'Có phải nộp thuế nhà thờ ([de:Kirchensteuer]) không?',
  'form.yes': 'Có',
  'form.no': 'Không',
  'form.childAllowances.label': 'Mức miễn thuế cho con ([de:Kinderfreibeträge])',
  'form.childAllowances.hint':
    'Theo dữ liệu khấu trừ thuế của bạn (ELStAM). Chỉ ảnh hưởng đến phụ thu đoàn kết và thuế nhà thờ.',
  'form.childAllowances.note': 'Ở nhóm thuế V và VI không tính mức miễn thuế cho con.',
  'form.health.legend': 'Bảo hiểm y tế',
  'form.health.type': 'Loại bảo hiểm y tế',
  'form.health.statutory': 'Bảo hiểm công (theo luật định)',
  'form.health.private': 'Bảo hiểm tư nhân',
  'form.additionalRate.label': 'Mức phí bổ sung của quỹ bảo hiểm y tế ([de:Zusatzbeitrag])',
  'form.additionalRate.hint':
    'Mức bình quân năm {year}: {average}. Mức của quỹ bạn có trên trang web của quỹ hoặc trên bảng lương.',
  'form.kvPremium.label': 'Phí hằng tháng, bảo hiểm y tế gói cơ bản',
  'form.kvPremium.hint': 'Chỉ tính phí cho gói cơ bản, không gồm quyền lợi bổ sung hoặc nâng cao.',
  'form.pvPremium.label': 'Phí hằng tháng, bảo hiểm chăm sóc dài hạn bắt buộc',
  'form.employerSubsidy.label': 'Tính cả khoản hỗ trợ của người sử dụng lao động',
  'form.care.legend': 'Bảo hiểm chăm sóc dài hạn',
  'form.hasChildren.legend': 'Bạn có con không (tư cách làm cha mẹ)?',
  'form.childrenUnder25.label': 'Số con dưới 25 tuổi',
  'form.childrenUnder25.hint': 'Từ con thứ hai, mức đóng bảo hiểm chăm sóc dài hạn được giảm (tối đa bốn lần giảm).',
  'form.age23.legend': 'Từ 23 tuổi trở lên?',
  'form.more.title': 'Thêm chi tiết',
  'form.pension.label': 'Thuộc diện bảo hiểm hưu trí bắt buộc',
  'form.unemployment.label': 'Thuộc diện bảo hiểm thất nghiệp bắt buộc',
  'form.allowance.label': 'Mức miễn thuế tiền lương hằng tháng (ELStAM)',
  'form.allowance.hint': 'Chỉ nhập nếu bạn có mức miễn thuế đã được đăng ký.',
  'form.factor.label': 'Hệ số (nhóm thuế IV có hệ số)',
  'form.factor.hint': 'Từ 0,001 đến 0,999 với tối đa ba chữ số thập phân. Để trống nếu bạn không dùng phương pháp hệ số.',
  'form.submit': 'Tính lương thực nhận',
  'form.reset': 'Đặt lại',

  'result.title': 'Kết quả',
  'result.empty': 'Nhập lương gộp của bạn và chọn “Tính lương thực nhận”. Kết quả sẽ hiện ở đây.',
  'result.net': 'Thực nhận',
  'result.perMonth': 'mỗi tháng',
  'result.perYear': 'mỗi năm',
  'result.gross': 'Lương gộp ([de:Bruttogehalt])',
  'result.net.total': 'Lương thực nhận ([de:Nettogehalt])',
  'result.taxes.total': 'Tổng thuế',
  'result.social.total': 'Tổng bảo hiểm xã hội',
  'result.legend.taxes': 'Thuế',
  'result.legend.social': 'Bảo hiểm xã hội',
  'result.legend.entry': '{label}: {amount} ({share})',
  'result.table.caption': 'Chi tiết từ lương gộp đến lương thực nhận',
  'result.table.item': 'Khoản mục',
  'result.table.month': 'Mỗi tháng',
  'result.table.year': 'Mỗi năm',
  'result.employer.title': 'Chi phí của người sử dụng lao động',
  'result.employer.caption': 'Chi phí của người sử dụng lao động mỗi tháng và mỗi năm',
  'result.employer.totalCost': 'Tổng chi phí của người sử dụng lao động',
  'result.employer.note': 'Chưa gồm các khoản đóng góp theo quỹ (U1, U2, U3), bảo hiểm tai nạn và các chi phí phát sinh khác.',
  'result.print': 'In',
  'result.sources.cite': { other: 'Nguồn:' },

  'section.explain.title': 'Cách tính và nguồn dẫn',
  'section.explain.intro':
    'Phần này cho thấy từng khoản mục hình thành như thế nào – với số liệu của bạn và các nguồn chính thức. Số tiền được làm tròn đến cent. Nhấp vào một khoản mục để mở rộng phần tính.',
  'section.sources.title': 'Danh sách nguồn',
  'section.sources.intro': 'Tất cả các nguồn được dùng trong phép tính. Liên kết bên ngoài mở trong tab mới.',
  'section.limits.title': 'Giới hạn của máy tính này',
  'section.limits.intro': 'Máy tính mô phỏng mức lương hằng tháng thông thường của một người lao động theo quy định pháp luật năm {year}. Không bao gồm:',
  'section.limits.item1': 'Lương hưu từ việc làm ([de:Versorgungsbezüge]) và lương hưu doanh nghiệp, khoản giảm trừ theo tuổi',
  'section.limits.item2': 'Các khoản thanh toán một lần và thu nhập khác (ví dụ thưởng Giáng sinh), lợi ích bằng hiện vật (ví dụ xe công ty)',
  'section.limits.item3': 'Chuyển đổi lương và hưu trí doanh nghiệp, bảo hiểm hưu trí thợ mỏ, “Aktivrente”, làm việc ngắn hạn',
  'section.limits.item4': 'Mức thuế nhà thờ tối thiểu và mức trần thuế nhà thờ, khoản cộng thêm, nhiều việc làm cùng lúc',
  'section.limits.item5': 'Các khoản đóng góp theo quỹ của người sử dụng lao động (U1, U2, U3) trong chi phí của người sử dụng lao động',
  'section.limits.assumptions':
    'Giả định: lương như nhau trong cả mười hai tháng; số liệu cả năm bằng mười hai lần số liệu hằng tháng. Kết quả không thay thế bảng lương hay tư vấn thuế.',

  'footer.status': 'Tình trạng pháp lý {year} · dữ liệu cập nhật đến {dataAsOf}',
  'footer.local': 'Phép tính chạy hoàn toàn trong trình duyệt của bạn. Không cookie, không truyền dữ liệu.',
  'footer.disclaimer':
    'Không phải tư vấn thuế hay pháp lý; mọi thông tin không có bảo đảm. Cơ sở là sơ đồ quy trình chính thức của Bộ Tài chính Liên bang Đức về khấu trừ thuế tiền lương năm {year} và các giá trị bảo hiểm xã hội theo luật năm {year}.',
  'footer.nav': 'Pháp lý',
  'footer.legal': 'Thông tin pháp lý ([de:Impressum])',
  'footer.privacyLink': 'Bảo mật dữ liệu ([de:Datenschutz])',
  'footer.a11y': 'Khả năng tiếp cận',

  'legal.meta.title': 'Thông tin pháp lý – máy tính lương Brutto–Netto',
  'legal.meta.description': 'Thông tin pháp lý (Impressum) của máy tính lương Brutto–Netto.',
  'legal.title': 'Thông tin pháp lý ([de:Impressum])',
  'legal.placeholderNotice':
    'Lưu ý cho người vận hành: các thông tin trong ngoặc vuông chỉ là chỗ giữ chỗ và phải được thay bằng thông tin thật của người vận hành trước khi công bố (§ 5 DDG).',
  'legal.provider.title': 'Thông tin theo § 5 DDG',
  'legal.provider.name': '[Tên cá nhân hoặc công ty vận hành trang web]',
  'legal.provider.address': '[Đường và số nhà, mã bưu chính và thành phố]',
  'legal.contact.title': 'Liên hệ',
  'legal.contact.email': 'Email: [địa chỉ email]',
  'legal.contact.phone': 'Điện thoại: [số điện thoại, không bắt buộc]',
  'legal.responsible.title': 'Người chịu trách nhiệm về nội dung',
  'legal.responsible.text': '[Tên và địa chỉ người chịu trách nhiệm, nếu khác]',
  'legal.liability.title': 'Miễn trừ trách nhiệm',
  'legal.liability.content':
    'Nội dung của trang web này được biên soạn hết sức cẩn thận. Tuy nhiên, chúng tôi không bảo đảm tính chính xác, đầy đủ hay cập nhật của các phép tính và văn bản. Kết quả chỉ là giá trị tham khảo, không có tính ràng buộc.',
  'legal.liability.links':
    'Trang web này dẫn đến các nguồn bên ngoài (ví dụ luật và ấn phẩm của cơ quan nhà nước). Chỉ các đơn vị vận hành những nguồn đó chịu trách nhiệm về nội dung của chúng.',
  'legal.calc.title': 'Không phải tư vấn',
  'legal.calc.text':
    'Máy tính lương Brutto–Netto không thay thế bảng lương cũng như tư vấn về thuế, pháp lý hay bảo hiểm xã hội. Bảng lương của người sử dụng lao động luôn là căn cứ quyết định.',

  'privacy.meta.title': 'Chính sách bảo mật và khả năng tiếp cận – máy tính lương Brutto–Netto',
  'privacy.meta.description': 'Chính sách bảo mật và tuyên bố về khả năng tiếp cận của máy tính lương Brutto–Netto.',
  'privacy.title': 'Chính sách bảo mật ([de:Datenschutzerklärung])',
  'privacy.placeholderNotice':
    'Lưu ý cho người vận hành: các thông tin trong ngoặc vuông chỉ là chỗ giữ chỗ và phải được điền trước khi công bố. Hãy rà soát lại văn bản, đặc biệt nếu bạn dùng nhà cung cấp dịch vụ lưu trữ xử lý thêm dữ liệu.',
  'privacy.controller.title': 'Bên chịu trách nhiệm xử lý dữ liệu',
  'privacy.controller.text': '[Tên và địa chỉ người vận hành, địa chỉ email – xem phần thông tin pháp lý]',
  'privacy.overview.title': 'Tóm tắt',
  'privacy.overview.text': 'Máy tính này được xây dựng để dữ liệu bạn nhập không bao giờ rời khỏi thiết bị của bạn:',
  'privacy.overview.item1': 'Mọi phép tính chạy hoàn toàn trong trình duyệt của bạn. Thông tin của bạn không được gửi đến máy chủ.',
  'privacy.overview.item2': 'Không đặt cookie và không lưu dữ liệu trong trình duyệt (không dùng localStorage, sessionStorage hay IndexedDB).',
  'privacy.overview.item3': 'Không có dịch vụ phân tích hay theo dõi, không có nội dung của bên thứ ba được nhúng vào, không có phông chữ bên ngoài và không có mạng phân phối nội dung (CDN).',
  'privacy.overview.item4': 'Vì vậy không cần biểu ngữ cookie.',
  'privacy.hosting.title': 'Lưu trữ và tệp nhật ký máy chủ',
  'privacy.hosting.text':
    'Khi trang được yêu cầu, nhà cung cấp dịch vụ lưu trữ xử lý các dữ liệu kết nối cần thiết về mặt kỹ thuật (ví dụ địa chỉ IP, thời điểm, trang được yêu cầu, loại trình duyệt) trong các tệp nhật ký máy chủ để cung cấp trang và vận hành an toàn. Cơ sở pháp lý là Art. 6 Abs. 1 lit. f DSGVO. Nhà cung cấp dịch vụ lưu trữ: [tên và địa chỉ nhà cung cấp dịch vụ lưu trữ].',
  'privacy.url.title': 'Dữ liệu nhập trên thanh địa chỉ',
  'privacy.url.text':
    'Sau khi tính, thông tin của bạn được lưu dưới dạng tham số trên thanh địa chỉ (URL) để bạn có thể đánh dấu hoặc chia sẻ kết quả. URL chỉ nằm trong trình duyệt của bạn; nó chỉ đến tay bên thứ ba khi chính bạn chia sẻ.',
  'privacy.links.title': 'Liên kết bên ngoài',
  'privacy.links.text':
    'Các nguồn dẫn liên kết đến trang web của cơ quan nhà nước và bộ. Khi nhấp, trang đích mở trong tab mới; không có địa chỉ giới thiệu (referrer) nào được gửi đi. Đơn vị vận hành các trang đó chịu trách nhiệm về việc xử lý dữ liệu tại đó.',
  'privacy.rights.title': 'Quyền của bạn',
  'privacy.rights.text':
    'Bạn có quyền truy cập, chỉnh sửa, xóa, hạn chế xử lý, chuyển dữ liệu và phản đối, cũng như quyền khiếu nại với cơ quan giám sát bảo vệ dữ liệu.',

  'a11y.title': 'Tuyên bố về khả năng tiếp cận',
  'a11y.status':
    'Mục tiêu của trang web này là tuân thủ Web Content Accessibility Guidelines (WCAG) 2.2, mức AA. Tình trạng: ngày 1 tháng 10 năm 2026. Các trang được kiểm tra tự động bằng axe-core (không có phát hiện) và kiểm tra thủ công bằng bàn phím.',
  'a11y.measures':
    'Các biện pháp đã thực hiện gồm: HTML ngữ nghĩa với tiêu đề và vùng định hướng, điều khiển bằng bàn phím không có bẫy tiêu điểm, tiêu điểm hiển thị rõ, độ tương phản đủ ở chế độ sáng và tối, thông báo lỗi gắn với từng trường, hỗ trợ chữ lớn và màn hình hẹp (bố cục tự co giãn đến 320 pixel) và kiểu in.',
  'a11y.limits':
    'Giới hạn đã biết: các nguồn được liên kết (ví dụ tài liệu PDF của cơ quan nhà nước) không thuộc quyền kiểm soát của chúng tôi và có thể không tiếp cận được. Chưa kiểm tra với tất cả các trình đọc màn hình phổ biến.',
  'a11y.feedback': 'Vui lòng báo các rào cản về địa chỉ liên hệ trong phần thông tin pháp lý. Chúng tôi cố gắng xử lý các phản hồi nhanh chóng.',
};
