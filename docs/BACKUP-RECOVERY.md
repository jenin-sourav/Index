# Backup Strategy & Disaster Recovery Runbook
## Apex International School (AIS Dhaka)

---

## 1. Backup Policy & Objectives

- **Recovery Point Objective (RPO):** Maximum 1 hour of potential data delta.
- **Recovery Time Objective (RTO):** Full institutional restoration within 30 minutes.
- **Retention Period:** Daily snapshots retained for 30 days; weekly snapshots retained for 12 months; annual archive snapshots retained indefinitely.

---

## 2. Automated Database Backup Procedures

### PostgreSQL Production Backup Script (`backup-db.sh`)
```bash
#!/bin/bash
set -e

BACKUP_DIR="/var/backups/ais-school"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="${BACKUP_DIR}/ais_db_${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

# Perform compressed streaming dump
pg_dump -U ais_db_admin -h localhost -d ais_production | gzip > "$FILENAME"

# Encrypt backup archive with OpenSSL AES-256-CBC
openssl enc -aes-256-cbc -salt -in "$FILENAME" -out "${FILENAME}.enc" -kfile /etc/ais-backup.key
rm "$FILENAME"

# Sync to encrypted offsite cloud storage (e.g. AWS S3 Glacier / Cloud Storage)
aws s3 cp "${FILENAME}.enc" s3://ais-dhaka-encrypted-backups/database/

# Prune local backups older than 30 days
find "$BACKUP_DIR" -type f -name "*.enc" -mtime +30 -exec rm {} +
```

### SQLite Standalone Backup
For environments running the embedded relational SQLite database:
```bash
sqlite3 prisma/school.db ".backup 'prisma/backups/school_$(date +%Y%m%d_%H%M%S).db'"
```

---

## 3. Disaster Recovery Restoration Procedure

In the event of hardware failure, database corruption, or ransomware disaster:

1. **Provision Clean Server / Container Instance:**
   - Install verified Node.js and database runtime.
   - Configure environment secrets from safe vault.

2. **Retrieve Latest Encrypted Backup:**
   ```bash
   aws s3 cp s3://ais-dhaka-encrypted-backups/database/latest_backup.enc ./
   openssl enc -d -aes-256-cbc -in latest_backup.enc -out restore.sql.gz -kfile /etc/ais-backup.key
   gunzip restore.sql.gz
   ```

3. **Restore Database:**
   ```bash
   psql -U ais_db_admin -d ais_production < restore.sql
   ```

4. **Verify Relational Integrity:**
   - Execute verification query:
     ```sql
     SELECT COUNT(*) FROM "Student";
     SELECT COUNT(*) FROM "ExamResult";
     SELECT COUNT(*) FROM "Invoice";
     ```

5. **Start Application Service:**
   ```bash
   pm2 restart ais-dhaka
   ```
