# Maria Rodriguez Teaching Dataset - SQL Scripts

## Overview

This directory contains SQL scripts to load the Maria Rodriguez teaching dataset into an OMOP CDM 5.4 PostgreSQL database. The dataset provides a complete clinical case study for the Clinical Informatics Textbook.

## Files

| File | Description |
|------|-------------|
| `maria_rodriguez_teaching_dataset.sql` | Complete INSERT statements for all OMOP CDM tables |

## Patient Summary

**Maria Rodriguez** - Primary teaching case study patient

| Attribute | Value |
|-----------|-------|
| Person ID | 12345 |
| MRN | MRN12345 |
| Age | 46 years (DOB: March 15, 1979) |
| Gender | Female |
| Race | White |
| Ethnicity | Hispanic/Latino |
| Insurance | Illinois Medicaid |
| Occupation | Elementary School Teacher |

## Clinical Profile

### Active Conditions

| Condition | ICD-10 | SNOMED Concept | Onset |
|-----------|--------|----------------|-------|
| Type 2 Diabetes Mellitus | E11.9 | 201826 | 2023-01-15 |
| Essential Hypertension | I10 | 320128 | 2021-03-10 |
| Obesity | E66.9 | 433736 | 2021-03-10 |
| Atrial Fibrillation | I48.91 | 313217 | 2026-01-13 |

### Current Medications

| Medication | RxNorm | Dose | Indication |
|------------|--------|------|------------|
| Metformin | 861007 | 1000mg BID | T2DM |
| Lisinopril | 314076 | 20mg daily | HTN |
| Apixaban | 1364435 | 5mg BID | AFib (stroke prevention) |
| Metoprolol Succinate | 866924 | 25mg daily | AFib (rate control) |

### Risk Scores

| Score | Value | Interpretation |
|-------|-------|----------------|
| CHA₂DS₂-VASc | 3 | HIGH stroke risk (3.2%/year) |
| HAS-BLED | 1 | LOW bleeding risk |

## Care Team

| Provider | Role | NPI | Care Site |
|----------|------|-----|-----------|
| Dr. Sarah Chen, MD | Primary Care Physician | 1234567890 | Community Health Clinic |
| Lisa Brown, RN | Care Coordinator | - | Community Health Clinic |
| Dr. Michael Torres, MD | Cardiologist | 0987654321 | Springfield Cardiology Associates |
| Jessica Martinez, PharmD | Clinical Pharmacist | - | Community Health Clinic |

## Clinical Timeline

```
2021-03-10  HTN & Obesity diagnosed
2023-01-15  Type 2 DM diagnosed, Metformin started
...
2026-01-10  Labs drawn (HbA1c 8.2%, fasting glucose 162)
2026-01-13  PCP visit - AFib discovered on EKG
            → Apixaban & Metoprolol started
            → Labs ordered (TSH, CBC, CMP)
2026-01-16  Lab results return (TSH 1.8, CBC normal)
2026-01-17  Cardiology consult with Dr. Torres
            → Echo: LVEF 55%, LA mildly dilated
2026-01-27  PCP follow-up - BP improved (132/82)
2026-02-14  Cardiology follow-up
```

## Usage

### Prerequisites

1. PostgreSQL database with OMOP CDM 5.4 schema
2. Vocabulary tables populated (SNOMED, RxNorm, LOINC, ICD10CM, CPT4)
3. CDM schema named `cdm` (or modify search_path)

### Load the Data

```bash
# Connect to your database and run the script
psql -d your_database -f maria_rodriguez_teaching_dataset.sql

# Or from psql prompt
\i maria_rodriguez_teaching_dataset.sql
```

### Verify Load

The script includes verification queries at the end. Expected counts:

| Table | Records |
|-------|---------|
| person | 1 |
| visit_occurrence | 4 |
| condition_occurrence | 4 |
| measurement | 26 |
| drug_exposure | 4 |
| procedure_occurrence | 6 |
| observation | 7 |
| provider | 4 |
| care_site | 2 |
| location | 3 |

## Data Alignment with Textbook Chapters

| Chapter | Tables Used | Key Data Points |
|---------|-------------|-----------------|
| Ch 1: Patient Arrives | person, location | Demographics, registration |
| Ch 2: Clinical Encounter | visit_occurrence, measurement | Vitals, SOAP note |
| Ch 3: Diagnostic Workup | measurement, procedure_occurrence | Labs, EKG |
| Ch 4: Specialty Referral | visit_occurrence, provider | Cardiology consult |
| Ch 5: Medication Management | drug_exposure | New prescriptions |
| Ch 6: Clinical Decision Support | observation | Risk scores |
| Ch 7: Quality Measurement | condition_occurrence, measurement | HEDIS gaps |
| Ch 8: Billing & Coding | procedure_occurrence | CPT codes |

## Concept IDs Reference

### Condition Concepts (SNOMED)

| Concept ID | Concept Name | ICD-10 Source |
|------------|--------------|---------------|
| 201826 | Type 2 diabetes mellitus | E11.9 |
| 320128 | Essential hypertension | I10 |
| 433736 | Obesity | E66.9 |
| 313217 | Atrial fibrillation | I48.91 |

### Drug Concepts (RxNorm)

| Concept ID | Concept Name | RxNorm Code |
|------------|--------------|-------------|
| 1503297 | Metformin 1000 MG Oral Tablet | 861007 |
| 1308216 | Lisinopril 20 MG Oral Tablet | 314076 |
| 40228152 | Apixaban 5 MG Oral Tablet | 1364435 |
| 19078461 | Metoprolol Succinate 25 MG ER | 866924 |

### Measurement Concepts (LOINC)

| Concept ID | Concept Name | LOINC Code |
|------------|--------------|------------|
| 3004249 | Systolic blood pressure | 8480-6 |
| 3012888 | Diastolic blood pressure | 8462-4 |
| 3027018 | Heart rate | 8867-4 |
| 3034639 | Hemoglobin A1c | 4548-4 |
| 3004501 | Glucose [Mass/volume] | 2339-0 |

## Notes

- All IDs use high values (12345, 70001-70004, etc.) to avoid conflicts with existing data
- Uses `ON CONFLICT DO NOTHING` for idempotent loading
- Concept IDs are based on OMOP vocabulary v5.0+
- Dates set in January-February 2026 to match textbook timeline
