from django.db import models

class User(models.AbstractUser):
    email = models.CharField()

class EconomicIndicator(models.Model):
    indicator_id = models.CharField(max_length=50)
    date = models.DateField()
    value = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
          models.UniqueConstraint(
            fields=("indicator_id", "date"), name="unique_indicator"
          )
        ]

    def __str__(self):
        return f"{self.indicator_id} - ({self.date}) - {self.value}"


class IndicatorMetadata(models.Model):
    indicator_id = models.OneToOneField(EconomicIndicator, on_delete=models.CASCADE, related_name='metadata')
    full_name = models.CharField(max_length=50)
    common_name = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.indicator_id} - {self.full_name} - {self.common_name}"

class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ReportEntry(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='entries')
    indicator = models.ForeignKey(EconomicIndicator, on_delete=models.CASCADE)
    current_period_date = models.DateField()
    current_period_value = models.FloatField()
    prior_period_date = models.DateField()
    prior_period_value = models.FloatField()

    def common_name(self):
        return self.indicator.metadata.common_name if self.indicator.metadata else ""

    def __str__(self):
        return f"{self.common_name()}: ({self.current_period_date} vs {self.prior_period_date})"
