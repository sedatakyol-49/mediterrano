import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  AdminSession,
  ContentRevision,
  MediaItem,
  SiteContent,
} from '../models/content';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private csrf = '';

  async session(): Promise<AdminSession> {
    const session = await firstValueFrom(
      this.http.get<AdminSession>('/api/index.php?action=session'),
    );
    this.csrf = session.csrf;
    return session;
  }

  async login(email: string, password: string): Promise<AdminSession> {
    const session = await this.write<AdminSession>('login', {
      email,
      password,
    });
    this.csrf = session.csrf;
    return session;
  }

  logout(): Promise<unknown> {
    return this.write('logout', {});
  }
  draft(): Promise<ContentRevision> {
    return firstValueFrom(
      this.http.get<ContentRevision>('/api/index.php?action=draft'),
    );
  }
  media(): Promise<{ items: MediaItem[] }> {
    return firstValueFrom(
      this.http.get<{ items: MediaItem[] }>('/api/index.php?action=media'),
    );
  }
  save(content: SiteContent, revision: number): Promise<ContentRevision> {
    return this.write('draft', { content, revision }, 'PUT');
  }
  publish(revision: number): Promise<ContentRevision> {
    return this.write('publish', { revision });
  }
  upload(file: File, alt: string): Promise<{ item: MediaItem }> {
    const data = new FormData();
    data.append('image', file);
    data.append('alt', alt);
    return this.write('upload', data);
  }

  private async write<T>(
    action: string,
    body: unknown,
    method = 'POST',
  ): Promise<T> {
    await this.session();
    return firstValueFrom(
      this.http.request<T>(method, `/api/index.php?action=${action}`, {
        body,
        headers: { 'X-CSRF-Token': this.csrf },
      }),
    );
  }
}
