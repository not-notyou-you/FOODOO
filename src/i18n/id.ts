// src/i18n/id.ts
import type { en } from "./en.ts";

export const id: Record<keyof typeof en, string> = {
  "app.name": "FOODOO",
  "app.skip": "Langsung ke isi",
  "app.loading": "Memuat…",
  "app.offlineReady": "Siap dipakai tanpa internet.",
  "app.valueLine":
    "Perencanaan porsi harian yang ikut menghitung pembeli yang tidak kebagian saat menu habis.",

  "nav.main": "Navigasi utama",
  "nav.today": "Hari ini",
  "nav.plan": "Rencana",
  "nav.service": "Jualan",
  "nav.close": "Tutup",
  "nav.settings": "Pengaturan",
  "nav.soon": "Segera",

  "header.demo": "Data demo",
  "header.offline": "Offline. Tersimpan di perangkat ini.",

  "common.save": "Simpan",
  "common.cancel": "Batal",
  "common.back": "Kembali",
  "common.next": "Lanjut",
  "common.edit": "Ubah",
  "common.archive": "Arsipkan",
  "common.restore": "Pulihkan",
  "common.closeDialog": "Tutup dialog",
  "common.yes": "Ya",
  "common.no": "Belum",
  "common.saveFailed": "Gagal menyimpan. Silakan coba lagi.",

  "lang.label": "Bahasa",
  "lang.en": "English",
  "lang.id": "Bahasa Indonesia",

  "welcome.title": "Selamat datang di FOODOO",
  "welcome.start": "Mulai pengaturan",
  "welcome.continue": "Lanjutkan pengaturan",
  "welcome.demo": "Coba warung demo",
  "welcome.demoNote":
    "Warung demo memakai data buatan supaya Anda bisa melihat-lihat dulu.",
  "welcome.demoBlocked":
    "Anda sudah mulai mengatur warung sendiri. Hapus datanya di Pengaturan untuk mencoba demo.",

  "setup.step": "Langkah {step} dari {total}",
  "setup.menus.title": "Menu Anda",
  "setup.menus.intro":
    "Tambahkan setiap masakan yang Anda masak pagi hari. Bisa diubah nanti di Pengaturan.",
  "setup.menus.needOne": "Tambahkan minimal satu menu untuk lanjut.",
  "setup.hours.title": "Jam buka",
  "setup.hours.intro": "Jam berapa buka dan tutup, dan jam mana yang ramai?",
  "setup.done": "Pengaturan selesai. Anda siap merencanakan.",
  "setup.hours.finish": "Selesai",

  "menu.list.empty": "Belum ada menu. Tambahkan menu pertama Anda.",
  "menu.list.add": "Tambah menu",
  "menu.list.archived": "Menu diarsipkan ({count})",
  "menu.list.summary": "{price} · modal {cost} · biasanya {qty} porsi",
  "menu.list.editLabel": "Ubah {name}",
  "menu.list.archiveLabel": "Arsipkan {name}",
  "menu.list.restoreLabel": "Pulihkan {name}",
  "menu.editor.addTitle": "Tambah menu",
  "menu.editor.editTitle": "Ubah menu",
  "menu.field.name": "Nama menu",
  "menu.field.price": "Harga jual (Rp)",
  "menu.field.cost": "Modal per porsi (Rp)",
  "menu.field.salvage": "Nilai porsi sisa (Rp)",
  "menu.field.salvageHint":
    "Nilai porsi yang tidak terjual bagi Anda, misalnya untuk makan pegawai. Biasanya 0.",
  "menu.field.usualQty": "Porsi biasa per hari",
  "menu.error.nameLength": "Isi nama 1 sampai 40 karakter",
  "menu.error.priceInvalid": "Isi harga dalam rupiah bulat, lebih dari 0",
  "menu.error.costInvalid": "Isi modal dalam rupiah bulat, 0 atau lebih",
  "menu.error.costNotBelowPrice": "Modal harus lebih rendah dari harga",
  "menu.error.salvageInvalid": "Isi nilai dalam rupiah bulat, 0 atau lebih",
  "menu.error.salvageNotBelowPrice":
    "Nilai porsi sisa harus lebih rendah dari harga",
  "menu.error.usualInvalid": "Isi angka bulat dari 1 sampai 999",
  "menu.saved": "Menu tersimpan",
  "menu.archivedToast": "Menu diarsipkan",
  "menu.restoredToast": "Menu dipulihkan",

  "hours.open": "Jam buka",
  "hours.close": "Jam tutup",
  "hours.error.timeInvalid": "Isi jam dengan format JJ:MM",
  "hours.error.closeNotAfterOpen":
    "Jam tutup harus setelah jam buka, di hari yang sama",
  "hours.busyTitle": "Jam ramai",
  "hours.busyHint":
    "Ketuk satu jam untuk mengubahnya: sepi, biasa, ramai. Jam ramai berarti lebih banyak pembeli datang.",
  "hours.busyEmpty": "Isi jam buka yang benar untuk melihat jam ramai.",
  "hours.level.1": "Sepi",
  "hours.level.2": "Biasa",
  "hours.level.4": "Ramai",
  "hours.saved": "Jam buka tersimpan",

  "today.title": "Hari ini",
  "today.loopTitle": "Siklus hari ini",
  "today.phase.plan": "Rencana",
  "today.phase.service": "Jualan",
  "today.phase.close": "Tutup",
  "today.status.done": "Selesai",
  "today.status.current": "Sekarang",
  "today.status.next": "Berikutnya",
  "today.action.plan": "Rencanakan porsi hari ini",
  "today.action.service": "Buka layar jualan",
  "today.action.close": "Tutup hari ini",
  "today.action.done": "Sampai jumpa besok",
  "today.doneNote":
    "Hari ini sudah ditutup. Kembali besok pagi untuk merencanakan.",
  "today.counts.title": "Ringkasan hari ini",
  "today.counts.portions": "Porsi direncanakan",
  "today.counts.soldOut": "Menu habis",
  "today.counts.closed": "Hari ditutup",
  "today.empty.setupTitle": "Selesaikan pengaturan",
  "today.empty.setupBody":
    "Tambahkan menu dan jam buka untuk mendapatkan saran harian.",
  "today.empty.setupAction": "Lanjutkan pengaturan",
  "today.empty.menusTitle": "Tidak ada menu aktif",
  "today.empty.menusBody":
    "Semua menu diarsipkan. Tambahkan atau pulihkan menu di Pengaturan.",
  "today.empty.menusAction": "Buka Pengaturan",

  "soon.title": "Segera hadir",
  "soon.body": "Layar ini dibuat pada tahap prototipe berikutnya.",
  "soon.back": "Kembali ke Hari ini",

  "settings.title": "Pengaturan",
  "settings.stall.title": "Warung",
  "settings.stall.name": "Nama warung (opsional)",
  "settings.stall.nameError": "Paling banyak 40 karakter",
  "settings.stall.nameSaved": "Nama warung tersimpan",
  "settings.menus.title": "Menu",
  "settings.hours.title": "Jam buka dan jam ramai",
  "settings.hours.save": "Simpan jam",
  "settings.language.title": "Bahasa",
  "settings.data.title": "Data",
  "settings.data.onDevice":
    "Semua data hanya disimpan di perangkat ini. Tidak ada yang dikirim ke mana pun.",
  "settings.data.loadDemo": "Muat warung demo",
  "settings.data.resetDemo": "Atur ulang data demo",
  "settings.data.loadDemoBlocked":
    "Hapus data Anda sendiri dulu untuk memuat warung demo.",
  "settings.data.demoLoaded": "Warung demo dimuat",
  "settings.data.removeDemo": "Hapus warung demo",
  "settings.data.deleteAll": "Hapus semua data",
  "settings.delete.title": "Hapus semua data?",
  "settings.delete.body":
    "Ini menghapus semua menu, rencana, dan catatan dari perangkat ini. Tidak bisa dibatalkan.",
  "settings.delete.confirm": "Hapus semuanya",
  "settings.removeDemo.title": "Hapus warung demo?",
  "settings.removeDemo.body":
    "Ini menghapus semua data demo. Setelah itu Anda bisa mengatur warung sendiri.",
  "settings.removeDemo.confirm": "Hapus demo",
  "settings.about.title": "Tentang",
  "settings.about.version": "Versi {version}",
  "settings.about.body":
    "FOODOO menyarankan porsi dengan aturan tetap yang bisa dijelaskan. Tidak memakai model AI. Lisensi pustaka dan huruf, serta bantuan AI yang dipakai untuk membangun aplikasi ini, tercantum di README proyek.",
  "settings.about.link": "Buka README proyek",

  "reason.history.soldOutWeekday":
    "Habis pada {soldOut} dari {observations} hari {weekdayPlural} terakhir → {delta}",
  "reason.history.soldOutRecent":
    "Habis pada {soldOut} dari {observations} hari terakhir → {delta}",
  "reason.history.leftover":
    "Ada sisa pada {leftover} dari {observations} hari terakhir → {delta}",
  "reason.history.base": "Berdasarkan {observations} hari terakhir",
  "reason.coldStart":
    "Riwayat belum cukup. Mulai dari porsi biasa Anda, {usualQty}",
  "reason.coldStartUp":
    "Riwayat belum cukup. Mulai dari porsi biasa Anda, {usualQty}, terakhir kali habis",
  "reason.coldStartDown":
    "Riwayat belum cukup. Mulai dari porsi biasa Anda, {usualQty}, terakhir kali ada sisa",

  "weekday.plural.0": "Minggu",
  "weekday.plural.1": "Senin",
  "weekday.plural.2": "Selasa",
  "weekday.plural.3": "Rabu",
  "weekday.plural.4": "Kamis",
  "weekday.plural.5": "Jumat",
  "weekday.plural.6": "Sabtu",
};
