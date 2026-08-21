package com.jhonarangotoro.icitas

import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ReminderAlarmsModule.NAME)
class ReminderAlarmsModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "ReminderAlarms"
  }

  override fun getName() = NAME

  @ReactMethod
  fun canScheduleExactAlarms(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
        promise.resolve(true)
        return
      }
      val alarmManager =
        reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
      promise.resolve(alarmManager.canScheduleExactAlarms())
    } catch (error: Exception) {
      promise.reject("EXACT_ALARM", error)
    }
  }

  @ReactMethod
  fun isIgnoringBatteryOptimizations(promise: Promise) {
    try {
      val powerManager =
        reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
      promise.resolve(
        powerManager.isIgnoringBatteryOptimizations(reactApplicationContext.packageName)
      )
    } catch (error: Exception) {
      promise.reject("BATTERY", error)
    }
  }

  @ReactMethod
  fun openExactAlarmSettings(promise: Promise) {
    try {
      val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
          data = Uri.parse("package:${reactApplicationContext.packageName}")
        }
      } else {
        appDetailsIntent()
      }
      start(intent)
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("EXACT_ALARM_SETTINGS", error)
    }
  }

  @ReactMethod
  fun requestIgnoreBatteryOptimizations(promise: Promise) {
    try {
      val packageName = reactApplicationContext.packageName
      val powerManager =
        reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
      if (powerManager.isIgnoringBatteryOptimizations(packageName)) {
        promise.resolve(true)
        return
      }
      start(
        Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
          data = Uri.parse("package:$packageName")
        }
      )
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("BATTERY_SETTINGS", error)
    }
  }

  @ReactMethod
  fun openAppSettings(promise: Promise) {
    try {
      start(appDetailsIntent())
      promise.resolve(true)
    } catch (error: Exception) {
      promise.reject("APP_SETTINGS", error)
    }
  }

  private fun appDetailsIntent(): Intent {
    return Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
      data = Uri.parse("package:${reactApplicationContext.packageName}")
    }
  }

  private fun start(intent: Intent) {
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    val activity = currentActivity
    if (activity != null) {
      activity.startActivity(intent)
    } else {
      reactApplicationContext.startActivity(intent)
    }
  }
}
