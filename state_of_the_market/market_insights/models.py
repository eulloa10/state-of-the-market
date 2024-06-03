from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin
from django.db import models

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('A valid email address must be provided')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
      extra_fields.setdefault('is_staff', False)
      extra_fields.setdefault('is_superuser', False)
      return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def get_short_name(self):
      return self.email.split('@')[0]

    def __str__(self):
        return self.email

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
    entries = models.ManyToManyField('ReportEntry', related_name='reports')

    def __str__(self):
        return self.title

class ReportEntry(models.Model):
    indicator = models.ForeignKey(EconomicIndicator, on_delete=models.CASCADE)
    current_period_date = models.DateField()
    current_period_value = models.FloatField()
    prior_period_date = models.DateField()
    prior_period_value = models.FloatField()

    def common_name(self):
        return self.indicator.metadata.common_name if self.indicator.metadata else ""

    def __str__(self):
        return f"{self.common_name()}: ({self.current_period_date} vs {self.prior_period_date})"
