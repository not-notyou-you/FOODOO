// src/i18n/en.ts
export const en = {
  "app.name": "FOODOO",
  "app.skip": "Skip to content",
  "app.loading": "Loading…",
  "app.offlineReady": "Ready to work offline.",
  "app.valueLine":
    "Daily portion planning that counts the customers a sold-out menu hides.",

  "nav.main": "Main navigation",
  "nav.today": "Today",
  "nav.plan": "Plan",
  "nav.service": "Service",
  "nav.close": "Close",
  "nav.settings": "Settings",
  "nav.soon": "Soon",

  "header.demo": "Demo data",
  "header.offline": "Offline. Saved on this device.",

  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.back": "Back",
  "common.next": "Next",
  "common.edit": "Edit",
  "common.archive": "Archive",
  "common.restore": "Restore",
  "common.closeDialog": "Close dialog",
  "common.yes": "Yes",
  "common.no": "No",
  "common.saveFailed": "Could not save. Please try again.",

  "lang.label": "Language",
  "lang.en": "English",
  "lang.id": "Bahasa Indonesia",

  "welcome.title": "Welcome to FOODOO",
  "welcome.start": "Start setup",
  "welcome.continue": "Continue setup",
  "welcome.demo": "Try demo stall",
  "welcome.demoNote":
    "The demo stall uses made-up data so you can look around first.",
  "welcome.demoBlocked":
    "You have started your own setup. Delete it in Settings to try the demo.",

  "setup.step": "Step {step} of {total}",
  "setup.menus.title": "Your menus",
  "setup.menus.intro":
    "Add each dish you cook in the morning. You can change them later in Settings.",
  "setup.menus.needOne": "Add at least one menu to continue.",
  "setup.hours.title": "Opening hours",
  "setup.hours.intro": "When do you open and close, and which hours are busy?",
  "setup.done": "Setup complete. You are ready to plan.",
  "setup.hours.finish": "Finish setup",

  "menu.list.empty": "No menus yet. Add your first menu.",
  "menu.list.add": "Add menu",
  "menu.list.archived": "Archived menus ({count})",
  "menu.list.summary": "{price} · cost {cost} · usual {qty} portions",
  "menu.list.editLabel": "Edit {name}",
  "menu.list.archiveLabel": "Archive {name}",
  "menu.list.restoreLabel": "Restore {name}",
  "menu.editor.addTitle": "Add menu",
  "menu.editor.editTitle": "Edit menu",
  "menu.field.name": "Menu name",
  "menu.field.price": "Selling price (Rp)",
  "menu.field.cost": "Cost per portion (Rp)",
  "menu.field.salvage": "Value of a leftover portion (Rp)",
  "menu.field.salvageHint":
    "What an unsold portion is still worth to you, for example as a staff meal. Usually 0.",
  "menu.field.usualQty": "Usual portions per day",
  "menu.error.nameLength": "Enter a name of 1 to 40 characters",
  "menu.error.priceInvalid": "Enter a price in whole rupiah, above 0",
  "menu.error.costInvalid": "Enter a cost in whole rupiah, 0 or more",
  "menu.error.costNotBelowPrice": "Cost must be lower than price",
  "menu.error.salvageInvalid": "Enter a value in whole rupiah, 0 or more",
  "menu.error.salvageNotBelowPrice": "Leftover value must be lower than price",
  "menu.error.usualInvalid": "Enter a whole number from 1 to 999",
  "menu.saved": "Menu saved",
  "menu.archivedToast": "Menu archived",
  "menu.restoredToast": "Menu restored",

  "hours.open": "Opening time",
  "hours.close": "Closing time",
  "hours.error.timeInvalid": "Enter a time as HH:MM",
  "hours.error.closeNotAfterOpen":
    "Closing time must be after opening time, on the same day",
  "hours.busyTitle": "Busy hours",
  "hours.busyHint":
    "Tap an hour to change it: quiet, normal, busy. Busier hours mean more customers arrive then.",
  "hours.busyEmpty": "Set valid opening hours to see the busy hours.",
  "hours.level.1": "Quiet",
  "hours.level.2": "Normal",
  "hours.level.4": "Busy",
  "hours.saved": "Hours saved",

  "today.title": "Today",
  "today.loopTitle": "Today's loop",
  "today.phase.plan": "Plan",
  "today.phase.service": "Service",
  "today.phase.close": "Close",
  "today.status.done": "Done",
  "today.status.current": "Now",
  "today.status.next": "Next",
  "today.action.plan": "Plan today's portions",
  "today.action.service": "Open service",
  "today.action.close": "Close the day",
  "today.action.done": "See you tomorrow",
  "today.doneNote": "Today is closed. Come back tomorrow morning to plan.",
  "today.counts.title": "Today so far",
  "today.counts.portions": "Portions planned",
  "today.counts.soldOut": "Menus sold out",
  "today.counts.closed": "Day closed",
  "today.empty.setupTitle": "Finish setting up",
  "today.empty.setupBody":
    "Add your menus and opening hours to get daily suggestions.",
  "today.empty.setupAction": "Continue setup",
  "today.empty.menusTitle": "No active menus",
  "today.empty.menusBody":
    "All menus are archived. Add or restore a menu in Settings.",
  "today.empty.menusAction": "Open Settings",

  "soon.title": "Coming soon",
  "soon.body": "This screen is built in the next step of the prototype.",
  "soon.back": "Back to Today",

  "settings.title": "Settings",
  "settings.stall.title": "Stall",
  "settings.stall.name": "Stall name (optional)",
  "settings.stall.nameError": "Use at most 40 characters",
  "settings.stall.nameSaved": "Stall name saved",
  "settings.menus.title": "Menus",
  "settings.hours.title": "Hours and busy hours",
  "settings.hours.save": "Save hours",
  "settings.language.title": "Language",
  "settings.data.title": "Data",
  "settings.data.onDevice":
    "Everything is stored only on this device. Nothing is sent anywhere.",
  "settings.data.loadDemo": "Load demo stall",
  "settings.data.resetDemo": "Reset demo data",
  "settings.data.loadDemoBlocked":
    "Delete your own data first to load the demo stall.",
  "settings.data.demoLoaded": "Demo stall loaded",
  "settings.data.removeDemo": "Remove demo stall",
  "settings.data.deleteAll": "Delete all data",
  "settings.delete.title": "Delete all data?",
  "settings.delete.body":
    "This removes every menu, plan and record from this device. It cannot be undone.",
  "settings.delete.confirm": "Delete everything",
  "settings.removeDemo.title": "Remove the demo stall?",
  "settings.removeDemo.body":
    "This removes all demo data. You can then set up your own stall.",
  "settings.removeDemo.confirm": "Remove demo",
  "settings.about.title": "About",
  "settings.about.version": "Version {version}",
  "settings.about.body":
    "FOODOO suggests portions with fixed, explainable rules. It uses no AI model. The licences of the libraries and fonts, and the AI assistance used to build the app, are listed in the project README.",
  "settings.about.link": "Open the project README",

  "reason.history.soldOutWeekday":
    "Sold out on {soldOut} of the last {observations} {weekdayPlural} → {delta}",
  "reason.history.soldOutRecent":
    "Sold out on {soldOut} of the last {observations} days → {delta}",
  "reason.history.leftover":
    "Leftovers on {leftover} of the last {observations} days → {delta}",
  "reason.history.base": "Based on the last {observations} days",
  "reason.coldStart":
    "Not enough history yet. Starting from your usual {usualQty}",
  "reason.coldStartUp":
    "Not enough history yet. Starting from your usual {usualQty}, sold out last time",
  "reason.coldStartDown":
    "Not enough history yet. Starting from your usual {usualQty}, leftovers last time",

  "weekday.plural.0": "Sundays",
  "weekday.plural.1": "Mondays",
  "weekday.plural.2": "Tuesdays",
  "weekday.plural.3": "Wednesdays",
  "weekday.plural.4": "Thursdays",
  "weekday.plural.5": "Fridays",
  "weekday.plural.6": "Saturdays",
} as const;
