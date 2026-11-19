# Visa Wise

A deterministic, rules-based matcher for Canada and US immigration pathways. Live at https://visa-wise.vercel.app

## What it does

You enter a profile and your goals, and Visa Wise returns the Canadian and US immigration pathways that fit. Results come from fixed rules, not generated text. Wrong answers on this subject carry real consequences, so every result can be traced back to a rule and tested.

## How it works

The rules engine lives in lib and evaluates a profile against pathway rules stored in data. A scheduled GitHub Actions workflow refreshes the immigration data every week, and scripts holds the data tooling.

## Stack

Next.js, TypeScript and pnpm, deployed on Vercel.

## Run it locally

Run pnpm install, then pnpm dev, and open http://localhost:3000.

## Status

Prototype. It never reached a production release, and it is not a substitute for advice from a licensed immigration professional.
